import sqlite3
import networkx as nx
import datetime
from collections import defaultdict

def load_graph_from_db(db_path='aml_synthetic.db'):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Load all transactions
    cursor.execute("SELECT * FROM transactions")
    txns = cursor.fetchall()
    conn.close()
    
    # Create MultiDiGraph
    G = nx.MultiDiGraph()
    for tx in txns:
        # Parse timestamp safely
        try:
            ts = datetime.datetime.fromisoformat(tx['timestamp'])
        except ValueError:
            # Fallback if there's any parsing issue
            ts = datetime.datetime.now()
            
        G.add_edge(
            tx['sender_acc_id'], 
            tx['receiver_acc_id'], 
            key=tx['id'],
            txn_id=tx['id'],
            amount=tx['amount'],
            timestamp=ts,
            pattern_label=tx['pattern_label']
        )
    return G

def trace_money_trail(G, start_node, start_txn_id, max_depth=5, max_hours_delay=48):
    """
    Traces forward money flow from a starting transaction.
    Rules: Step N+1 must occur strictly after Step N and within `max_hours_delay`.
    """
    # Find the starting edge data
    start_edges = []
    for u, v, k, data in G.out_edges(start_node, keys=True, data=True):
        if data['txn_id'] == start_txn_id:
            start_edges.append((u, v, k, data))
            
    if not start_edges:
        return []
        
    start_edge = start_edges[0]
    
    # Simple BFS to find paths
    # Queue stores: (current_node, current_path_of_edges, last_timestamp)
    queue = [(start_edge[1], [start_edge], start_edge[3]['timestamp'])]
    trails = []
    
    while queue:
        curr_node, path, last_ts = queue.pop(0)
        
        if len(path) == max_depth:
            trails.append(path)
            continue
            
        extended = False
        for u, v, k, data in G.out_edges(curr_node, keys=True, data=True):
            tx_time = data['timestamp']
            time_diff = (tx_time - last_ts).total_seconds() / 3600.0
            
            # Next transaction must be after the previous one, but within the time window
            if 0 < time_diff <= max_hours_delay:
                # Prevent looping in the basic trace
                visited_nodes = [edge[0] for edge in path] + [curr_node]
                if v not in visited_nodes:
                    queue.append((v, path + [(u, v, k, data)], tx_time))
                    extended = True
                    
        if not extended and len(path) > 1:
            trails.append(path)
            
    return trails

def detect_rapid_layering(G, min_hops=4, max_hours_per_hop=24):
    """
    Detects long, rapid chains of transfers characteristic of layering.
    """
    layering_paths = []
    # Identify potential starts (nodes with outgoing transfers)
    # This is compute intensive for large graphs, but works for our synthetic scale
    for start_node in G.nodes():
        for u, v, k, data in G.out_edges(start_node, keys=True, data=True):
            trails = trace_money_trail(G, start_node, data['txn_id'], max_depth=min_hops, max_hours_delay=max_hours_per_hop)
            for trail in trails:
                if len(trail) >= min_hops:
                    layering_paths.append(trail)
    return layering_paths

def detect_time_bound_cycles(G, max_days=30):
    """
    Detects strict time-ordered cycles (Round-Tripping).
    A -> B -> C -> A where t(A->B) < t(B->C) < t(C->A) and total time < max_days.
    """
    cycles_found = []
    
    # Convert MultiDiGraph to simple DiGraph to use NetworkX simple_cycles
    # (Since simple_cycles doesn't handle MultiDiGraph cleanly and scales poorly, 
    # we'll use a bounded depth-first search for small cycles)
    
    def dfs_cycle(start_node, curr_node, path, last_ts):
        if len(path) > 6: # limit cycle length to prevent explosion
            return
            
        for u, v, k, data in G.out_edges(curr_node, keys=True, data=True):
            tx_time = data['timestamp']
            
            # Must move forward in time
            if tx_time > last_ts:
                # Check total time window
                first_ts = path[0][3]['timestamp']
                if (tx_time - first_ts).days <= max_days:
                    if v == start_node and len(path) >= 2:
                        cycles_found.append(path + [(u, v, k, data)])
                    else:
                        # Prevent self-intersections (except returning to start)
                        visited = [p[0] for p in path]
                        if v not in visited:
                            dfs_cycle(start_node, v, path + [(u, v, k, data)], tx_time)

    for node in G.nodes():
        for u, v, k, data in G.out_edges(node, keys=True, data=True):
            dfs_cycle(node, v, [(u, v, k, data)], data['timestamp'])
            
    # Deduplicate cycles (since A->B->C->A is the same as B->C->A->B)
    unique_cycles = []
    seen_txn_sets = set()
    for cycle in cycles_found:
        txn_ids = frozenset([edge[3]['txn_id'] for edge in cycle])
        if txn_ids not in seen_txn_sets:
            seen_txn_sets.add(txn_ids)
            unique_cycles.append(cycle)
            
    return unique_cycles

def detect_structuring(G, threshold=10000, time_window_days=30):
    """
    Detects Fan-Out + Fan-In patterns.
    Source -> {Smurfs} -> Target, where individual amounts < threshold.
    """
    structuring_cases = []
    
    # Pre-compute edges to optimize
    edges = list(G.edges(keys=True, data=True))
    
    # 1. Find all Fan-Outs from a source
    # Map: Source Node -> Time Window -> List of edges to distinct intermediaries
    for source in G.nodes():
        out_edges = [e for e in edges if e[0] == source and e[3]['amount'] < threshold]
        
        # Group by smurf (intermediary)
        smurf_edges = defaultdict(list)
        for e in out_edges:
            smurf_edges[e[1]].append(e)
            
        if len(smurf_edges) >= 2: # At least 2 smurfs
            # Check Fan-In from these smurfs to a common target
            smurfs = list(smurf_edges.keys())
            
            all_fan_ins = defaultdict(list)
            for smurf in smurfs:
                smurf_out = [e for e in edges if e[0] == smurf]
                for e in smurf_out:
                    all_fan_ins[e[1]].append(e)
                    
            # A valid target is one that receives money from multiple smurfs shortly after
            for target, in_edges in all_fan_ins.items():
                if target == source:
                    continue # Ignore round-tripping here
                
                # Check if target received from at least 2 distinct smurfs
                contributing_smurfs = set(e[0] for e in in_edges)
                if len(contributing_smurfs) >= 2:
                    case = {
                        "source": source,
                        "target": target,
                        "smurfs": list(contributing_smurfs),
                        "fan_out_txns": [],
                        "fan_in_txns": []
                    }
                    
                    # Collect the specific transactions that fit the pattern
                    for smurf in contributing_smurfs:
                        # Find the fan-out tx to this smurf
                        f_outs = [e[3]['txn_id'] for e in smurf_edges[smurf]]
                        # Find the fan-in tx from this smurf to target
                        f_ins = [e[3]['txn_id'] for e in in_edges if e[0] == smurf]
                        
                        case["fan_out_txns"].extend(f_outs)
                        case["fan_in_txns"].extend(f_ins)
                        
                    structuring_cases.append(case)
                    
    # Deduplicate cases easily
    seen_cases = set()
    unique_structuring = []
    for c in structuring_cases:
        key = (c['source'], c['target'], tuple(sorted(c['smurfs'])))
        if key not in seen_cases:
            seen_cases.add(key)
            unique_structuring.append(c)
            
    return unique_structuring

def calculate_risk_scores(G, layering_paths, cycles, structuring_cases):
    """
    Applies a basic scoring mechanism to all transactions and nodes.
    """
    txn_scores = defaultdict(int)
    txn_flags = defaultdict(list)
    
    # Score Layering
    for path in layering_paths:
        for u, v, k, data in path:
            txn_id = data['txn_id']
            txn_scores[txn_id] += 60
            if "Rapid Layering" not in txn_flags[txn_id]:
                txn_flags[txn_id].append("Rapid Layering")
                
    # Score Cycles
    for cycle in cycles:
        for u, v, k, data in cycle:
            txn_id = data['txn_id']
            txn_scores[txn_id] += 50
            if "Round-Tripping Cycle" not in txn_flags[txn_id]:
                txn_flags[txn_id].append("Round-Tripping Cycle")
                
    # Score Structuring
    for case in structuring_cases:
        for txn_id in case["fan_out_txns"]:
            txn_scores[txn_id] += 70
            if "Structuring (Fan-Out)" not in txn_flags[txn_id]:
                txn_flags[txn_id].append("Structuring (Fan-Out)")
        for txn_id in case["fan_in_txns"]:
            txn_scores[txn_id] += 70
            if "Structuring (Fan-In)" not in txn_flags[txn_id]:
                txn_flags[txn_id].append("Structuring (Fan-In)")
                
    # Compile High Risk Alerts
    alerts = []
    for txn_id, score in txn_scores.items():
        if score >= 100:
            alerts.append({"txn_id": txn_id, "score": score, "flags": txn_flags[txn_id]})
            
    return txn_scores, txn_flags, alerts

if __name__ == "__main__":
    print("Loading Graph from Database...")
    G = load_graph_from_db('aml_synthetic.db')
    print(f"Graph loaded. Nodes: {G.number_of_nodes()}, Edges: {G.number_of_edges()}")
    
    print("\n[1] Detecting Rapid Layering...")
    layering = detect_rapid_layering(G, min_hops=4, max_hours_per_hop=24)
    print(f"Found {len(layering)} layering path(s).")
    
    print("\n[2] Detecting Time-Bound Cycles (Round-Tripping)...")
    cycles = detect_time_bound_cycles(G, max_days=30)
    print(f"Found {len(cycles)} cycle(s).")
    
    print("\n[3] Detecting Structuring (Smurfing)...")
    structuring = detect_structuring(G, threshold=10000)
    print(f"Found {len(structuring)} structuring case(s).")
    
    print("\n[4] Calculating Risk Scores...")
    txn_scores, txn_flags, alerts = calculate_risk_scores(G, layering, cycles, structuring)
    
    print("\n=== HIGH RISK TRANSACTIONS (>100 PA) ===")
    for alert in sorted(alerts, key=lambda x: x['score'], reverse=True):
        print(f"TXN: {alert['txn_id']} | Score: {alert['score']} | Flags: {', '.join(alert['flags'])}")
        
    print("\n=== SUMMARY OF TYPOLOGY HITS ===")
    # Print out specifically the transactions scored just below 100 for context
    medium_risk_count = sum(1 for s in txn_scores.values() if 50 <= s < 100)
    print(f"Total High Risk Alerts: {len(alerts)}")
    print(f"Total Medium Risk Txs: {medium_risk_count}")
