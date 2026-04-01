from app.database import db
from app.config import MONGODB_URL

print(f"DB Name: {db.name}")
print(f"MONGODB_URL: {MONGODB_URL}")
