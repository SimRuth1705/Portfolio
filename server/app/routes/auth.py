import bcrypt
from fastapi import APIRouter, HTTPException, Response, Depends, Request
from app.models import LoginIn
from app.auth import create_access_token, get_current_admin
from app.config import ADMIN_PASSWORD_HASH, JWT_EXPIRE_HOURS, JWT_SECRET, JWT_ALGORITHM
from jose import jwt

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login")
def login(data: LoginIn, response: Response):
    if not ADMIN_PASSWORD_HASH:
        raise HTTPException(status_code=500, detail="ADMIN_PASSWORD_HASH not configured")
    
    # Use native bcrypt for compatibility with Python 3.14
    is_valid = bcrypt.checkpw(
        data.password.encode('utf-8'), 
        ADMIN_PASSWORD_HASH.encode('utf-8')
    )
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = create_access_token({"sub": "admin", "role": "admin"})
    
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        max_age=JWT_EXPIRE_HOURS * 3600,
        samesite="none",
        secure=True,
        path="/"
    )
    
    return {"status": "success", "message": "Logged in"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("admin_token", path="/", samesite="none", secure=True)
    return {"status": "success", "message": "Logged out"}

@router.get("/me")
def get_me(request: Request):
    token = request.cookies.get("admin_token")
    if not token:
        return {"isAdmin": False}
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") == "admin":
            return {"isAdmin": True}
    except:
        pass
    return {"isAdmin": False}
