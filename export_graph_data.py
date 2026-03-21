import sqlite3
import json
import networkx as nx
import os
from collections import defaultdict

def export_to_frontend(db_path='aml_synthetic.db', output_path='aml-dashboard/public/data.json'):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Fetch all necessary entities
    cursor.execute("SELECT * FROM customers")
    customers = {row['id']: dict(row) for row in cursor.fetchall()}
    
    cursor.execute("SELECT * FROM accounts")
    accounts = {row['id']: dict(row) for row in cursor.fetchall()}
    
    cursor.execute("SELECT * FROM owns")
    for row in cursor.fetchall():
        if row['account_id'] in accounts:
            accounts[row['account_id']]['customer'] = customers.get(row['customer_id'])
            
    cursor.execute("SELECT * FROM transactions")
    txns = [dict(row) for row in cursor.fetchall()]
    
    conn.close()

    # Calculate node risks based on typology flags we scored in aml_detection
    # For a static UI, we'll embed the risk scores directly into the node and edge definitions
    # Wait, we need to run a quick scoring locally or just rely on the 'pattern_label' field
    # We injected: 'NORMAL', 'LAYERING', 'CIRCULAR', 'STRUCTURING_FAN_OUT', 'STRUCTURING_FAN_IN'
    
    # We will build a nodes and edges array for React Flow
    nodes_dict = {}
    edges_list = []
    
    # Add accounts as nodes
    for tx in txns:
        s = tx['sender_acc_id']
        r = tx['receiver_acc_id']
        label = tx['pattern_label']
        
        # Determine risk based on transaction participation
        risk_level = "low"
        if label != "NORMAL":
            risk_level = "high"
            
        if s not in nodes_dict:
            nodes_dict[s] = {
                "id": s, 
                "label": f"Account: {s}\n{accounts[s]['acc_type']} (${accounts[s]['balance']})",
                "risk": risk_level,
                "customer": accounts[s].get('customer', {}).get('name', 'Unknown')
            }
        elif risk_level == "high":
            nodes_dict[s]['risk'] = "high"
            
        if r not in nodes_dict:
            nodes_dict[r] = {
                "id": r, 
                "label": f"Account: {r}\n{accounts[r]['acc_type']} (${accounts[r]['balance']})",
                "risk": risk_level,
                "customer": accounts[r].get('customer', {}).get('name', 'Unknown')
            }
        elif risk_level == "high":
            nodes_dict[r]['risk'] = "high"
            
        edges_list.append({
            "id": tx['id'],
            "source": s,
            "target": r,
            "amount": tx['amount'],
            "currency": tx['currency'],
            "timestamp": tx['timestamp'],
            "pattern_label": tx['pattern_label']
        })
        
    # Isolate only subgraphs with suspicious activity to avoid pushing a 300+ edge hairball to UI
    suspicious_edges = [e for e in edges_list if e['pattern_label'] != 'NORMAL']
    suspicious_nodes = set()
    for e in suspicious_edges:
        suspicious_nodes.add(e['source'])
        suspicious_nodes.add(e['target'])
        
    # Build final React Flow payload
    flow_nodes = []
    # Simple layout math (Frontend can do d3-dagre or force layout)
    # Just position them roughly in a circle or line, the UI will handle force-layout or manual drag
    import math
    for i, node_id in enumerate(suspicious_nodes):
        node = nodes_dict[node_id]
        x = 400 + 300 * math.cos(i * 2 * math.pi / len(suspicious_nodes))
        y = 300 + 300 * math.sin(i * 2 * math.pi / len(suspicious_nodes))
        
        flow_nodes.append({
            "id": str(node["id"]),
            "position": {"x": x, "y": y},
            "data": {
                "label": node["label"], 
                "risk": node["risk"],
                "customer": node["customer"]
            }
        })
        
    flow_edges = []
    for e in suspicious_edges:
        edge_color = "#ff4444"
        edge_label = f"${e['amount']}"
        flow_edges.append({
            "id": str(e["id"]),
            "source": str(e["source"]),
            "target": str(e["target"]),
            "label": edge_label,
            "animated": True,
            "data": e  # Pass full transaction context into edge data
        })

    # Export a bundle of everything
    output_data = {
        "nodes": flow_nodes,
        "edges": flow_edges,
        "all_transactions": edges_list # The UI can use this for the timeline or searching
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=4)
        
    print(f"Data exported successfully to {output_path}")

if __name__ == "__main__":
    export_to_frontend()
