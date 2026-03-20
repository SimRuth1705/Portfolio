from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import ProjectIn, ProjectOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[ProjectOut])
def get_projects():
    try:
        projects = list(db.projects.find({}))
        return [ProjectOut(id=oid(p["_id"]), **{k:v for k,v in p.items() if k != "_id"}) for p in projects]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=ProjectOut)
def create_project(project: ProjectIn, _=Depends(get_current_admin)):
    try:
        doc = project.dict()
        doc["_id"] = ObjectId()
        result = db.projects.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return ProjectOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, project: ProjectIn, _=Depends(get_current_admin)):
    try:
        result = db.projects.update_one(
            {"_id": ObjectId(project_id)}, {"$set": project.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        updated = db.projects.find_one({"_id": ObjectId(project_id)})
        updated["id"] = project_id
        return ProjectOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str, _=Depends(get_current_admin)):
    try:
        result = db.projects.delete_one({"_id": ObjectId(project_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
