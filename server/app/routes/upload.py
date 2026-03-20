import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.auth import get_current_admin
from app.config import FRONTEND_URL

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("")
async def upload_file(file: UploadFile = File(...), _=Depends(get_current_admin)):
    try:
        # Check file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
            
        # Generate a unique filename or use the original one (simple version for now)
        filename = f"{os.urandom(8).hex()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Save the file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the public URL
        # For local development, this will be /static/uploads/filename
        return {"url": f"/static/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
