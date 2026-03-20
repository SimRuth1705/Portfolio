from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import SkillIn, SkillOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("", response_model=List[SkillOut])
def get_skills():
    try:
        skills = list(db.skills.find({}))
        return [SkillOut(id=oid(s["_id"]), **{k:v for k,v in s.items() if k != "_id"}) for s in skills]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=SkillOut)
def create_skill(skill: SkillIn, _=Depends(get_current_admin)):
    try:
        doc = skill.dict()
        doc["_id"] = ObjectId()
        result = db.skills.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return SkillOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(skill_id: str, skill: SkillIn, _=Depends(get_current_admin)):
    try:
        result = db.skills.update_one(
            {"_id": ObjectId(skill_id)}, {"$set": skill.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        updated = db.skills.find_one({"_id": ObjectId(skill_id)})
        updated["id"] = skill_id
        return SkillOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: str, _=Depends(get_current_admin)):
    try:
        result = db.skills.delete_one({"_id": ObjectId(skill_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
