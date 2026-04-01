from app.database import db
import re
import sys

print("--- CLEANING PROJECTS ---")
try:
    # Use a small limit and no timeout issues
    for p in db.projects.find().limit(50):
        url = p.get('image', '')
        title = p.get('title', 'Untitled')
        if "drive.google.com" in url:
            # Safer regex
            match = re.search(r'/d/([-\w]{25,})', url) or re.search(r'[?&]id=([-\w]{25,})', url)
            if match:
                file_id = match.group(1)
                new_url = f"https://drive.google.com/uc?export=view&id={file_id}"
                if new_url != url:
                    print(f"Fixing {title}: {url} -> {new_url}")
                    db.projects.update_one({"_id": p["_id"]}, {"$set": {"image": new_url}})
                else:
                    print(f"Skipping {title}: Already correct")
            else:
                print(f"Warning: Could not find ID in {url} for project {title}")
except Exception as e:
    print(f"Error: {e}")
print("--- CLEANUP DONE ---")
