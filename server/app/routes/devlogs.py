from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from app.models import DevlogIn, DevlogOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/devlogs", tags=["devlogs"])

@router.get("", response_model=List[DevlogOut])
def get_devlogs():
    try:
        devlogs = list(db.devlogs.find({}))
        return [DevlogOut(id=oid(d["_id"]), **{k:v for k,v in d.items() if k != "_id"}) for d in devlogs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=DevlogOut)
def create_devlog(devlog: DevlogIn, _=Depends(get_current_admin)):
    try:
        doc = devlog.dict()
        doc["_id"] = ObjectId()
        doc["created_at"] = datetime.now(timezone.utc).isoformat()
        result = db.devlogs.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return DevlogOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{devlog_id}", response_model=DevlogOut)
def update_devlog(devlog_id: str, devlog: DevlogIn, _=Depends(get_current_admin)):
    try:
        result = db.devlogs.update_one(
            {"_id": ObjectId(devlog_id)}, {"$set": devlog.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Devlog not found")
        updated = db.devlogs.find_one({"_id": ObjectId(devlog_id)})
        updated["id"] = devlog_id
        if "created_at" not in updated:
            updated["created_at"] = None
        return DevlogOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{devlog_id}", status_code=204)
def delete_devlog(devlog_id: str, _=Depends(get_current_admin)):
    try:
        result = db.devlogs.delete_one({"_id": ObjectId(devlog_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Devlog not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
