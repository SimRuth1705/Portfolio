from fastapi import APIRouter, Depends
from app.models import SettingsIn, SettingsOut
from app.database import db
from app.auth import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/{key}")
def get_setting(key: str):
    setting = db.settings.find_one({"key": key}, {"_id": 0})
    if not setting:
        # Default values
        if key == "theme":
            return {"key": "theme", "value": "dark"}
        return {"key": key, "value": ""}
    return setting

@router.put("/{key}")
def update_setting(key: str, data: SettingsIn, admin=Depends(get_current_admin)):
    db.settings.update_one(
        {"key": key},
        {"$set": {"value": data.value}},
        upsert=True
    )
    return {"status": "success"}
