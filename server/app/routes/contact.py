from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from app.models import ContactIn, ContactOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])

@router.post("", response_model=ContactOut)
def submit_contact(contact: ContactIn):
    try:
        doc = contact.dict()
        doc["_id"] = ObjectId()
        doc["created_at"] = datetime.now(timezone.utc).isoformat()
        result = db.contacts.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return ContactOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ContactOut])
def get_contacts(_=Depends(get_current_admin)):
    try:
        items = list(db.contacts.find({}))
        for item in items:
            item["id"] = oid(item["_id"])
        return [ContactOut(**item) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
