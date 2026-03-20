from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import ContentIn, ContentOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/content", tags=["content"])

@router.get("", response_model=List[ContentOut])
def get_all_content():
    try:
        items = list(db.content.find({}))
        return [ContentOut(id=oid(item["_id"]), section=item["section"], content=item["content"]) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{content_id}", response_model=ContentOut)
def get_content(content_id: str):
    try:
        # 1. Try finding by section field
        item = db.content.find_one({"section": content_id})
        
        # 2. Try finding by ObjectId if section lookup fails
        if not item:
            try:
                item = db.content.find_one({"_id": ObjectId(content_id)})
            except:
                item = None
        
        if item:
            return ContentOut(
                id=oid(item["_id"]),
                section=item.get("section", "unknown"),
                content=item.get("content", "")
            )

        # Fallback: Return empty object instead of 404
        return ContentOut(id="new", section=content_id, content="")
    except Exception as e:
        # Fallback for unexpected errors to prevent frontend crashes
        return ContentOut(id="error", section=content_id, content="")

@router.post("", response_model=ContentOut)
def create_content(content: ContentIn, _=Depends(get_current_admin)):
    try:
        doc = content.dict()
        doc["_id"] = ObjectId()
        result = db.content.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return ContentOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{content_id}", response_model=ContentOut)
def update_content(content_id: str, content: ContentIn, _=Depends(get_current_admin)):
    try:
        result = db.content.update_one(
            {"section": content_id},
            {"$set": {"section": content_id, "content": content.content}},
            upsert=True,
        )
        item = db.content.find_one({"section": content_id})
        item["id"] = oid(item["_id"])
        return ContentOut(**item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{content_id}", status_code=204)
def delete_content(content_id: str, _=Depends(get_current_admin)):
    try:
        result = db.content.delete_one({"_id": ObjectId(content_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Content not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
