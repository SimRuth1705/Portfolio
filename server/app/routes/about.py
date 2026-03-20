from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.database import db, oid
from app.auth import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/api/about", tags=["about"])

class SkillGroupIn(BaseModel):
    category: str
    items: List[str]

class SkillGroupOut(SkillGroupIn):
    id: str

class SoftSkillIn(BaseModel):
    title: str
    description: str

class SoftSkillOut(SoftSkillIn):
    id: str

@router.get("/skills", response_model=List[SkillGroupOut])
def get_about_skills():
    try:
        results = list(db.about_skills.find({}))
        if not results:
            # Seed default if empty
            default = [
                {"category": "Web Technologies", "items": ["React", "Node.js", "MongoDB", "Express"]},
                {"category": "Tools & Platforms", "items": ["Git", "GitHub", "Docker", "AWS"]},
                {"category": "Programming Languages", "items": ["JavaScript", "TypeScript", "Python"]}
            ]
            for d in default:
                db.about_skills.insert_one(d)
            results = list(db.about_skills.find({}))
            
        items = []
        for item in results:
            item["id"] = oid(item["_id"])
            items.append(SkillGroupOut(**item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/skills", response_model=SkillGroupOut)
def create_about_skill(skill: SkillGroupIn, _=Depends(get_current_admin)):
    try:
        doc = skill.dict()
        result = db.about_skills.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return SkillGroupOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/skills/{id}", status_code=204)
def delete_about_skill(id: str, _=Depends(get_current_admin)):
    try:
        db.about_skills.delete_one({"_id": ObjectId(id)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/skills/{id}", response_model=SkillGroupOut)
def update_about_skill(id: str, skill: SkillGroupIn, _=Depends(get_current_admin)):
    try:
        db.about_skills.update_one({"_id": ObjectId(id)}, {"$set": skill.dict()})
        updated = db.about_skills.find_one({"_id": ObjectId(id)})
        if not updated:
            raise HTTPException(status_code=404, detail="Skill group not found")
        updated["id"] = id
        return SkillGroupOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/soft-skills", response_model=List[SoftSkillOut])
def get_about_soft_skills():
    try:
        results = list(db.about_soft_skills.find({}))
        if not results:
            # Seed default if empty
            default = [
                {"title": "Leadership", "description": "Guiding and motivating teams"},
                {"title": "Problem Solving", "description": "Analyzing complex requirements"}
            ]
            for d in default:
                db.about_soft_skills.insert_one(d)
            results = list(db.about_soft_skills.find({}))

        items = []
        for item in results:
            item["id"] = oid(item["_id"])
            items.append(SoftSkillOut(**item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/soft-skills", response_model=SoftSkillOut)
def create_about_soft_skill(skill: SoftSkillIn, _=Depends(get_current_admin)):
    try:
        doc = skill.dict()
        result = db.about_soft_skills.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return SoftSkillOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/soft-skills/{id}", response_model=SoftSkillOut)
def update_about_soft_skill(id: str, skill: SoftSkillIn, _=Depends(get_current_admin)):
    try:
        db.about_soft_skills.update_one({"_id": ObjectId(id)}, {"$set": skill.dict()})
        updated = db.about_soft_skills.find_one({"_id": ObjectId(id)})
        if not updated:
            raise HTTPException(status_code=404, detail="Soft skill not found")
        updated["id"] = id
        return SoftSkillOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/soft-skills/{id}", status_code=204)
def delete_about_soft_skill(id: str, _=Depends(get_current_admin)):
    try:
        db.about_soft_skills.delete_one({"_id": ObjectId(id)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
