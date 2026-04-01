from app.database import db

print("--- PROJECTS ---")
for p in db.projects.find():
    print(f"Title: {p.get('title')}")
    print(f"Image: {p.get('image')}")
    print("-" * 20)
