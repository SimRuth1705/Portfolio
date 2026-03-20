from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import TimelineIn, TimelineOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/timeline", tags=["timeline"])

@router.get("", response_model=List[TimelineOut])
def get_timeline():
    try:
        items = list(db.timeline.find({}))
        return [TimelineOut(id=oid(item["_id"]), **{k:v for k,v in item.items() if k != "_id"}) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=TimelineOut)
def create_timeline_item(item: TimelineIn, _=Depends(get_current_admin)):
    try:
        doc = item.dict()
        doc["_id"] = ObjectId()
        result = db.timeline.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return TimelineOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{item_id}", response_model=TimelineOut)
def update_timeline_item(item_id: str, item: TimelineIn, _=Depends(get_current_admin)):
    try:
        result = db.timeline.update_one(
            {"_id": ObjectId(item_id)}, {"$set": item.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Timeline item not found")
        updated = db.timeline.find_one({"_id": ObjectId(item_id)})
        updated["id"] = item_id
        return TimelineOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{item_id}", status_code=204)
def delete_timeline_item(item_id: str, _=Depends(get_current_admin)):
    try:
        result = db.timeline.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Timeline item not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
