from fastapi import APIRouter, Depends
from app.database import db
from app.auth import get_current_admin

router = APIRouter(prefix="/api/vault", tags=["vault"])

@router.get("/stats")
def get_stats(_=Depends(get_current_admin)):
    return {
        "projects": db.projects.count_documents({}),
        "devlogs": db.devlogs.count_documents({}),
        "leads": db.contacts.count_documents({}),
        "testimonials": db.testimonials.count_documents({}),
        "skills": db.skills.count_documents({})
    }
