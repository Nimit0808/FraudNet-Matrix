import networkx as nx
import datetime

def create_aml_graph():
    """
    Creates an in-memory Resource Description Framework (RDF) / Property Graph 
    using NetworkX to model AML entities and relationships.
    """
    # Using MultiDiGraph because multiple transactions can exist between the same accounts
    G = nx.MultiDiGraph()

    # ==========================================
    # 1. ADD NODES (Entities)
    # ==========================================
    
    # Customers
    G.add_node("CUST_01", type="Customer", name="Alice Smith", kyc_status="Verified", risk_category="Low")
    G.add_node("CUST_02", type="Customer", name="Bob Jones", kyc_status="Pending", risk_category="High")
    G.add_node("CUST_03", type="Customer", name="Charlie Brown", kyc_status="Verified", risk_category="Medium")

    # Accounts
    G.add_node("ACC_01", type="Account", acc_type="Savings", balance=5000.0)
    G.add_node("ACC_02", type="Account", acc_type="Current", balance=150000.0)
    G.add_node("ACC_03", type="Account", acc_type="Loan", balance=-25000.0)

    # Branches
    G.add_node("BR_01", type="Branch", name="Downtown Main", loc="New York")
    G.add_node("BR_02", type="Branch", name="Uptown Branch", loc="New York")

    # Devices
    G.add_node("DEV_01", type="Device", device_type="Mobile", ip_address="192.168.1.5")
    G.add_node("DEV_02", type="Device", device_type="Desktop", ip_address="10.0.0.22")

    # Channels 
    # (Often modelled as edge properties, but requested as standalone nodes for routing/analysis)
    G.add_node("CH_UPI", type="Channel", name="UPI")
    G.add_node("CH_NEFT", type="Channel", name="NEFT")
    G.add_node("CH_RTGS", type="Channel", name="RTGS")


    # ==========================================
    # 2. ADD EDGES (Relationships)
    # ==========================================
    
    # Ownership (Customer -> Account)
    G.add_edge("CUST_01", "ACC_01", relation="OWNS", open_date="2020-01-15")
    G.add_edge("CUST_02", "ACC_02", relation="OWNS", open_date="2023-05-10")
    G.add_edge("CUST_03", "ACC_03", relation="OWNS", open_date="2021-11-20")

    # Account Location (Account -> Branch)
    G.add_edge("ACC_01", "BR_01", relation="HELD_AT")
    G.add_edge("ACC_02", "BR_02", relation="HELD_AT")
    G.add_edge("ACC_03", "BR_01", relation="HELD_AT")

    # Device Usage (Customer -> Device)
    G.add_edge("CUST_01", "DEV_01", relation="USES", last_active="2023-10-25")
    G.add_edge("CUST_02", "DEV_02", relation="USES", last_active="2023-10-26")
    
    # Shared Device Flag (Suspicious AML Pattern)
    G.add_edge("CUST_03", "DEV_02", relation="USES", last_active="2023-10-26")

    # Transactions (Account -> Account)
    # We include channel as an attribute, but we can also link to the Channel node.
    G.add_edge(
        "ACC_01", "ACC_02", 
        key="TXN_1001",           # Unique edge key in MultiDiGraph
        relation="TRANSACTION",
        amount=25000.00,
        currency="USD",
        timestamp=datetime.datetime.now().isoformat(),
        channel_id="CH_RTGS"
    )
    
    # Explicit Transaction Node (Alternative Pattern for Highly Complex AML Graphs)
    # Sometimes it's better to make the Transaction a node itself to map many-to-many properties
    G.add_node("TXN_1002", type="Transaction", amount=9000.0, currency="USD", date="2023-10-26")
    G.add_edge("ACC_02", "TXN_1002", relation="SENDER")
    G.add_edge("TXN_1002", "ACC_03", relation="RECEIVER")
    G.add_edge("TXN_1002", "CH_UPI", relation="VIA_CHANNEL")

    return G

def find_shared_devices(graph):
    """
    Example AML Query: Find devices used by multiple distinct customers.
    """
    suspicious_links = []
    
    # Filter only Device nodes
    devices = [n for n, attr in graph.nodes(data=True) if attr.get('type') == 'Device']
    
    for device in devices:
        # Find all incoming edges (Users pointing to this device)
        users = [u for u, v, k, data in graph.in_edges(device, keys=True, data=True) 
                 if data.get('relation') == 'USES']
        
        if len(users) > 1:
            suspicious_links.append({
                "device": device,
                "users": users
            })
            
    return suspicious_links

if __name__ == "__main__":
    aml_graph = create_aml_graph()
    print(f"Graph initialized with {aml_graph.number_of_nodes()} nodes and {aml_graph.number_of_edges()} edges.")
    
    shared = find_shared_devices(aml_graph)
    print("\n[AML ALERT] Shared Devices Detected:")
    for alert in shared:
        print(f"Device {alert['device']} is accessed by multiple customers: {alert['users']}")
