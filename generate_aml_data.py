import sqlite3
import random
import datetime
import uuid
import json
import os

def setup_db(db_path='aml_synthetic.db'):
    # Remove old DB if exists for a fresh start
    if os.path.exists(db_path):
        os.remove(db_path)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables aligned with the Step 1 Graph Schema
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT,
            kyc_status TEXT,
            risk_category TEXT
        );
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            acc_type TEXT,
            balance REAL
        );
        CREATE TABLE IF NOT EXISTS branches (
            id TEXT PRIMARY KEY,
            name TEXT,
            location TEXT
        );
        CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            device_type TEXT,
            ip_address TEXT
        );
        CREATE TABLE IF NOT EXISTS channels (
            id TEXT PRIMARY KEY,
            name TEXT
        );
        
        -- Relationships mapping tables
        CREATE TABLE IF NOT EXISTS owns (
            customer_id TEXT,
            account_id TEXT,
            open_date TEXT,
            PRIMARY KEY (customer_id, account_id),
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(account_id) REFERENCES accounts(id)
        );
        CREATE TABLE IF NOT EXISTS held_at (
            account_id TEXT,
            branch_id TEXT,
            PRIMARY KEY (account_id, branch_id),
            FOREIGN KEY(account_id) REFERENCES accounts(id),
            FOREIGN KEY(branch_id) REFERENCES branches(id)
        );
        CREATE TABLE IF NOT EXISTS uses (
            customer_id TEXT,
            device_id TEXT,
            last_active TEXT,
            PRIMARY KEY (customer_id, device_id),
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(device_id) REFERENCES devices(id)
        );
        
        -- Edges with heavy metadata (Transactions)
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            sender_acc_id TEXT,
            receiver_acc_id TEXT,
            amount REAL,
            currency TEXT,
            timestamp TEXT,
            channel_id TEXT,
            pattern_label TEXT,  -- Label to easily pull out injected typologies
            FOREIGN KEY(sender_acc_id) REFERENCES accounts(id),
            FOREIGN KEY(receiver_acc_id) REFERENCES accounts(id),
            FOREIGN KEY(channel_id) REFERENCES channels(id)
        );
    """)
    return conn

def generate_data(db_path='aml_synthetic.db'):
    conn = setup_db(db_path)
    cursor = conn.cursor()
    
    # -------------------------------------------------------------------------
    # 1. GENERATE BASE ENTITIES (Normal Data Profile)
    # -------------------------------------------------------------------------
    channels = [("CH_UPI", "UPI"), ("CH_NEFT", "NEFT"), ("CH_RTGS", "RTGS"), ("CH_SWIFT", "SWIFT")]
    cursor.executemany("INSERT INTO channels VALUES (?, ?)", channels)
    channel_ids = [c[0] for c in channels]
    
    branches = [(f"BR_{i:03d}", f"Branch {i}", random.choice(["New York", "London", "Tokyo", "Mumbai"])) for i in range(1, 6)]
    cursor.executemany("INSERT INTO branches VALUES (?, ?, ?)", branches)
    branch_ids = [b[0] for b in branches]
    
    # Generate 100 Customers with Accounts and Devices
    for i in range(1, 101):
        cust_id = f"CUST_{i:03d}"
        name = f"Customer {i}"
        kyc = random.choice(["Verified", "Verified", "Verified", "Pending"])
        risk = random.choice(["Low", "Low", "Medium", "High"])
        cursor.execute("INSERT INTO customers VALUES (?, ?, ?, ?)", (cust_id, name, kyc, risk))
        
        acc_id = f"ACC_{i:03d}"
        acc_type = random.choice(["Savings", "Current", "Corporate"])
        balance = round(random.uniform(1000, 100000), 2)
        cursor.execute("INSERT INTO accounts VALUES (?, ?, ?)", (acc_id, acc_type, balance))
        
        open_date = (datetime.date(2020, 1, 1) + datetime.timedelta(days=random.randint(0, 1000))).isoformat()
        cursor.execute("INSERT INTO owns VALUES (?, ?, ?)", (cust_id, acc_id, open_date))
        cursor.execute("INSERT INTO held_at VALUES (?, ?)", (acc_id, random.choice(branch_ids)))
        
        dev_id = f"DEV_{i:03d}"
        dev_type = random.choice(["Mobile", "Desktop", "Tablet"])
        ip = f"{random.randint(10, 192)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"
        cursor.execute("INSERT INTO devices VALUES (?, ?, ?)", (dev_id, dev_type, ip))
        
        last_active = (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 30))).isoformat()
        cursor.execute("INSERT INTO uses VALUES (?, ?, ?)", (cust_id, dev_id, last_active))

    print(f"Entities inserted: 100 Customers, 100 Accounts, 100 Devices, {len(branches)} Branches, {len(channels)} Channels.")

    # -------------------------------------------------------------------------
    # 2. GENERATE NORMAL TRANSACTIONS
    # -------------------------------------------------------------------------
    start_time = datetime.datetime.now() - datetime.timedelta(days=30)
    normal_txn_count = 300
    for _ in range(normal_txn_count):
        sender = f"ACC_{random.randint(1, 100):03d}"
        receiver = f"ACC_{random.randint(1, 100):03d}"
        while sender == receiver:
            receiver = f"ACC_{random.randint(1, 100):03d}"
        
        amt = round(random.uniform(10, 5000), 2)
        tx_time = start_time + datetime.timedelta(days=random.randint(0, 29), hours=random.randint(0, 23), minutes=random.randint(0, 59))
        ch = random.choice(channel_ids)
        txn_id = f"TXN_N_{uuid.uuid4().hex[:8]}"
        
        cursor.execute("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                       (txn_id, sender, receiver, amt, "USD", tx_time.isoformat(), ch, "NORMAL"))
    print(f"Inserted {normal_txn_count} normal background transactions.")

    # -------------------------------------------------------------------------
    # 3. INJECT TYPOLOGIES (Suspicious Patterns)
    # -------------------------------------------------------------------------
    
    # PATTERN 1: Rapid Layering
    # Definition: Funds move through a long path of accounts extremely quickly.
    # Path: ACC_010 -> ACC_020 -> ACC_030 -> ACC_040 -> ACC_050
    layering_accs = ["ACC_010", "ACC_020", "ACC_030", "ACC_040", "ACC_050"]
    layer_amount = 50000.0
    layer_time = start_time + datetime.timedelta(days=5, hours=10)
    
    for i in range(len(layering_accs) - 1):
        snd = layering_accs[i]
        rcv = layering_accs[i+1]
        txn_id = f"TXN_L_{uuid.uuid4().hex[:8]}"
        
        # Deduct a tiny arbitrary value for "fees" or slice, making it slightly harder to track linearly
        layer_amount -= round(random.uniform(5, 50), 2)
        
        # Super fast sequence (1 to 5 minutes between hops)
        layer_time += datetime.timedelta(minutes=random.randint(1, 5)) 
        
        cursor.execute("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                       (txn_id, snd, rcv, round(layer_amount, 2), "USD", layer_time.isoformat(), "CH_RTGS", "LAYERING"))
    print("Injected Typology: Rapid Layering (5 hops)")

    # PATTERN 2: Circular Transactions (Round-Tripping)
    # Definition: Funds move through several entities and return to original sender
    # Path: ACC_060 -> ACC_070 -> ACC_080 -> ACC_090 -> ACC_060
    circle_accs = ["ACC_060", "ACC_070", "ACC_080", "ACC_090"]
    circ_amount = 75000.0
    circ_time = start_time + datetime.timedelta(days=15, hours=9)
    
    for i in range(len(circle_accs)):
        snd = circle_accs[i]
        rcv = circle_accs[(i+1) % len(circle_accs)]
        txn_id = f"TXN_C_{uuid.uuid4().hex[:8]}"
        
        # Moves over a few hours/days
        circ_time += datetime.timedelta(hours=random.randint(1, 6))
        
        # Keep amount exact or near exact for obvious cycle
        cursor.execute("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                       (txn_id, snd, rcv, round(circ_amount, 2), "USD", circ_time.isoformat(), "CH_SWIFT", "CIRCULAR"))
    print("Injected Typology: Circular Transactions (4 nodes)")

    # PATTERN 3: Structuring (Smurfing)
    # Definition: Fan-out from source to intermediaries in amounts just below reporting threshold (~10k), then Fan-in to target
    # Source: ACC_001 -> Smurfs (ACC_002, ACC_003, ACC_004) -> Target: ACC_005
    source_acc = "ACC_001"
    smurfs = ["ACC_002", "ACC_003", "ACC_004"]
    target_acc = "ACC_005"
    smurf_time = start_time + datetime.timedelta(days=20, hours=8)
    
    # 3 deliberate sub-threshold transactions per smurf 
    amounts = [9500.0, 9800.0, 9200.0]
    
    for smurf in smurfs:
        for amt in amounts:
            # 3a. Fan-out
            txn_id_out = f"TXN_S_OUT_{uuid.uuid4().hex[:8]}"
            smurf_time += datetime.timedelta(hours=random.randint(1, 3))
            cursor.execute("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                           (txn_id_out, source_acc, smurf, amt, "USD", smurf_time.isoformat(), "CH_NEFT", "STRUCTURING_FAN_OUT"))
            
            # 3b. Fan-in (Smurfs send to Target delayed by a bit)
            txn_id_in = f"TXN_S_IN_{uuid.uuid4().hex[:8]}"
            in_time = smurf_time + datetime.timedelta(days=random.randint(1, 3), hours=random.randint(1, 5))
            cursor.execute("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                           (txn_id_in, smurf, target_acc, amt, "USD", in_time.isoformat(), "CH_UPI", "STRUCTURING_FAN_IN"))
    print("Injected Typology: Structuring / Smurfing (Fan-out & Fan-in via 3 smurfs)")

    conn.commit()
    conn.close()
    
    print(f"\nDatabase successfully generated at: {os.path.abspath(db_path)}")

if __name__ == "__main__":
    generate_data("aml_synthetic.db")
    
    # Optional JSON Export
    conn = sqlite3.connect("aml_synthetic.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE pattern_label != 'NORMAL'")
    suspicious_txns = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    with open("suspicious_patterns.json", "w") as f:
        json.dump(suspicious_txns, f, indent=4)
        
    print(f"Exported injected suspicious transactions to: {os.path.abspath('suspicious_patterns.json')}")
