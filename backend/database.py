from neo4j import GraphDatabase
import logging

# Configure Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connection string coordinates matching our docker-compose.yml
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "fund_dna_secure_pwd")

def get_db_driver():
    """Returns a Neo4j driver instance"""
    try:
        driver = GraphDatabase.driver(URI, auth=AUTH)
        driver.verify_connectivity()
        return driver
    except Exception as e:
        logger.error(f"Failed to connect to Neo4j: {e}")
        return None

def seed_database():
    """Wipes the database and seeds the exact Rapid Layering flow utilized in the React frontend."""
    driver = get_db_driver()
    if not driver:
        return {"error": "Database not reachable"}

    seed_query = """
    // 1. Clear Database
    MATCH (n) DETACH DELETE n;

    // 2. Create Global Corp Shell (Customer)
    CREATE (c1:Customer {id: 'CUST-8819', name: 'Global Corp Shell', risk_score: 95})
    CREATE (a1:Account {id: 'ACC-9921', name: 'Offshore Holding', balance: 0})
    CREATE (c1)-[:OWNS]->(a1)

    // 3. Create Cayman Branch 02 (Branch acting as intermediary)
    CREATE (b1:Branch {id: 'BR-CYM-02', name: 'Cayman Branch 02', jurisdiction: 'High-Risk'})
    
    // 4. Create Intermediate Trading Accounts
    CREATE (a2:Account {id: 'ACC-1102', name: 'Trading Acct 1', balance: 0})
    CREATE (a3:Account {id: 'ACC-1103', name: 'Trading Acct 2', balance: 0})

    // 5. Create Alexandrov LLC (Customer)
    CREATE (c2:Customer {id: 'CUST-4421', name: 'Alexandrov LLC', risk_score: 92})
    CREATE (a4:Account {id: 'ACC-4421-MAIN', name: 'Alexandrov Primary', balance: 0})
    CREATE (c2)-[:OWNS]->(a4)

    // 6. Create Channels
    CREATE (ch1:Channel {id: 'CH-CRYPTO', name: 'Crypto Network'})

    // 7. Inject Transactions (TRANSACTED_WITH edges)
    // Hop 1: Global Corp -> Cayman Branch (Rapid Layering initiator)
    CREATE (a1)-[:TRANSACTED_WITH {amount: 5200000, timestamp: '2026-03-22T10:15:00Z', channel_type: 'RTGS Transfer'}]->(b1)
    
    // Hop 2: Splitting Layer 1 (Structuring)
    CREATE (b1)-[:TRANSACTED_WITH {amount: 2600000, timestamp: '2026-03-22T10:45:00Z', channel_type: 'Wire Split Layering'}]->(a2)
    CREATE (b1)-[:TRANSACTED_WITH {amount: 2600000, timestamp: '2026-03-22T10:45:00Z', channel_type: 'Wire Split Layering'}]->(a3)

    // Hop 3: Integration (Direct & Crypto)
    CREATE (a2)-[:TRANSACTED_WITH {amount: 2600000, timestamp: '2026-03-22T11:30:00Z', channel_type: 'Direct Transfer'}]->(a4)
    CREATE (a3)-[r1:TRANSACTED_WITH {amount: 2550000, timestamp: '2026-03-22T11:05:00Z', channel_type: 'Exchange Route'}]->(ch1)
    CREATE (ch1)-[r2:TRANSACTED_WITH {amount: 2550000, timestamp: '2026-03-22T12:10:00Z', channel_type: 'Wallet Deposit'}]->(a4)
    """

    round_trip_seed = """
    // Seed isolated Circular Round-Tripping (Account A -> B -> C -> A)
    CREATE (omega_cust:Customer {id: 'CUST-999', name: 'Omega Logistics', risk_score: 94})
    CREATE (acct_a:Account {id: 'A-100', name: 'Omega Primary'})
    CREATE (acct_b:Account {id: 'B-200', name: 'Vendor Shell 1'})
    CREATE (acct_c:Account {id: 'C-300', name: 'Consulting Shell 2'})
    CREATE (omega_cust)-[:OWNS]->(acct_a)
    
    CREATE (acct_a)-[:TRANSACTED_WITH {amount: 1000000, timestamp: '2026-03-21T09:00:00Z', channel_type: 'Invoice Payment'}]->(acct_b)
    CREATE (acct_b)-[:TRANSACTED_WITH {amount: 950000, timestamp: '2026-03-21T14:00:00Z', channel_type: 'Consulting Fee'}]->(acct_c)
    CREATE (acct_c)-[:TRANSACTED_WITH {amount: 900000, timestamp: '2026-03-22T08:00:00Z', channel_type: 'Rebate'}]->(acct_a)
    """

    with driver.session() as session:
        session.run(seed_query)
        session.run(round_trip_seed)
        
    driver.close()
    return {"message": "Neo4j Database successfully wiped and seeded with Rapid Layering and Round-Tripping clusters."}

def run_rapid_layering_query():
    """
    Detects a path of 3 to 6 consecutive TRANSACTED_WITH hops between different 
    accounts/nodes demonstrating classical rapid layering velocity.
    """
    driver = get_db_driver()
    if not driver:
        return []

    # Primary highly performant cycle/path detection query utilizing native Cypher pathing
    query = """
    MATCH path = (start_node:Account)-[rels:TRANSACTED_WITH*3..6]->(end_node)
    // Basic topological validation 
    WITH path, nodes(path) AS ns
    WHERE size(apoc.coll.toSet(ns)) = size(ns) // Ensure no internal circular loops, purely layering
    RETURN 
        [n IN ns | {id: n.id, name: n.name, labels: labels(n)}] AS nodes,
        [r IN relationships(path) | {amount: r.amount, channel: r.channel_type}] AS edges
    LIMIT 5
    """
    
    results = []
    with driver.session() as session:
        try:
            records = session.run(query)
            for record in records:
                results.append({
                    "nodes": record["nodes"],
                    "edges": record["edges"]
                })
        except Exception as e:
            logger.warning(f"Neo4j Execution Error (APOC likely missing). Using fallback: {e}")
            fallback_query = """
            MATCH path = (start_node:Account)-[rels:TRANSACTED_WITH*3..6]->(end_node)
            RETURN 
                [n IN nodes(path) | {id: n.id, name: n.name, labels: labels(n)}] AS nodes,
                [r IN relationships(path) | {amount: r.amount, channel: r.channel_type}] AS edges
            LIMIT 5
            """
            fallback_records = session.run(fallback_query)
            for record in fallback_records:
                results.append({
                    "nodes": record["nodes"],
                    "edges": record["edges"]
                })
            
            
    driver.close()
    return results

def run_round_tripping_query():
    """
    Detects a cycle where money leaves an account, passes through 2 to 4 
    intermediaries, and intensely returns to the original account (Round-Tripping).
    """
    driver = get_db_driver()
    if not driver:
        return []

    query = """
    // Match a cyclic topological path returning to the exact initiator
    MATCH path = (a:Account)-[rels:TRANSACTED_WITH*2..4]->(a)
    RETURN 
        a.id AS initiator_id,
        [n IN nodes(path) | {id: n.id, name: n.name}] AS cycle_nodes,
        [r IN relationships(path) | r.amount] AS amounts
    LIMIT 5
    """

    results = []
    with driver.session() as session:
        records = session.run(query)
        for record in records:
            results.append({
                "initiator": record["initiator_id"],
                "cycle": record["cycle_nodes"],
                "amounts": record["amounts"]
            })
            
    driver.close()
    return results
