from app.database import db
import json

projects = list(db.projects.find({}, {"title": 1, "image": 1, "_id": 0}))
print(json.dumps(projects, indent=2))
