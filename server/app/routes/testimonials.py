from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import TestimonialIn, TestimonialOut
from app.database import db, oid
from app.auth import get_current_admin

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])

@router.get("", response_model=List[TestimonialOut])
def get_testimonials():
    try:
        items = list(db.testimonials.find({}))
        return [TestimonialOut(id=oid(t["_id"]), **{k:v for k,v in t.items() if k != "_id"}) for t in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=TestimonialOut)
def create_testimonial(testimonial: TestimonialIn, _=Depends(get_current_admin)):
    try:
        doc = testimonial.dict()
        doc["_id"] = ObjectId()
        result = db.testimonials.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        return TestimonialOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(testimonial_id: str, testimonial: TestimonialIn, _=Depends(get_current_admin)):
    try:
        result = db.testimonials.update_one(
            {"_id": ObjectId(testimonial_id)}, {"$set": testimonial.dict()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        updated = db.testimonials.find_one({"_id": ObjectId(testimonial_id)})
        updated["id"] = testimonial_id
        return TestimonialOut(**updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{testimonial_id}", status_code=204)
def delete_testimonial(testimonial_id: str, _=Depends(get_current_admin)):
    try:
        result = db.testimonials.delete_one({"_id": ObjectId(testimonial_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
