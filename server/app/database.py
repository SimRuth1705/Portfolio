from pymongo import MongoClient
from app.config import MONGODB_URL

client = MongoClient(MONGODB_URL)
# Get database name from the connection string or default to 'portfolio'
try:
    db_name = client.get_database().name
    if db_name == "test" and "portfolio" in MONGODB_URL.lower():
        db_name = "portfolio"
except:
    db_name = "portfolio"
db = client[db_name]

def oid(obj_id): 
    return str(obj_id)
