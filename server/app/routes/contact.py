from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime, timezone
from app.models import ContactIn, ContactOut
from app.database import db, oid
from app.auth import get_current_admin
from app.config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, TWILIO_TO_NUMBER
import urllib.request
import urllib.parse
import urllib.error
import base64
import json

router = APIRouter(prefix="/api/contact", tags=["contact"])

def send_whatsapp_notification(name, email, message, phone=None):
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_TO_NUMBER:
        return
    
    body_text = f"🚀 *New Portfolio Transmission*\n\n"
    body_text += f"👤 *Name:* {name}\n"
    body_text += f"📧 *Email:* {email}\n"
    if phone:
        body_text += f"📞 *Phone:* {phone}\n"
    body_text += f"\n📝 *Message:*\n{message}"

    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
    
    payload = {
        "From": TWILIO_FROM_NUMBER,
        "To": TWILIO_TO_NUMBER,
        "Body": body_text
    }
    
    try:
        data = urllib.parse.urlencode(payload).encode("utf-8")
        auth_str = f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}"
        auth_header = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")
        
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Authorization", f"Basic {auth_header}")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        
        with urllib.request.urlopen(req) as response:
            print(f"Twilio Notification Success: Status {response.status}")
    except urllib.error.HTTPError as e:
        print(f"Twilio HTTP Error: {e.code} - {e.reason}")
    except Exception as e:
        print(f"Twilio unexpected error: {e}")

@router.post("", response_model=ContactOut)
def submit_contact(contact: ContactIn):
    try:
        doc = contact.dict()
        doc["_id"] = ObjectId()
        doc["created_at"] = datetime.now(timezone.utc).isoformat()
        result = db.contacts.insert_one(doc)
        doc["id"] = oid(result.inserted_id)
        
        # Async-ish notification (doesn't block the response much)
        send_whatsapp_notification(
            contact.name, 
            contact.email, 
            contact.message, 
            getattr(contact, 'phone', None)
        )
        
        return ContactOut(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ContactOut])
def get_contacts(_=Depends(get_current_admin)):
    try:
        items = list(db.contacts.find({}))
        for item in items:
            item["id"] = oid(item["_id"])
        return [ContactOut(**item) for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}")
def delete_contact(id: str, _=Depends(get_current_admin)):
    try:
        print(f"DELETING CONTACT WITH ID: {id}")
        result = db.contacts.delete_one({"_id": ObjectId(id)})
        print(f"DELETE RESULT: {result.deleted_count} documents deleted")
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transmission not found")
        return {"success": True}
    except Exception as e:
        print(f"DELETE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
