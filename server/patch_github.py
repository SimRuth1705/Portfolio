from app.database import db

def patch_github_username():
    print("Patching github_username...")
    db.content.update_one(
        {"section": "github_username"},
        {"$set": {"section": "github_username", "content": "samsonraj"}},
        upsert=True
    )
    print("Done!")

if __name__ == "__main__":
    patch_github_username()
