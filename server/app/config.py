import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/portfolio")
JWT_SECRET = os.getenv("JWT_SECRET", "changeme-set-JWT_SECRET-in-env")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "whatsapp:+14155238886")
TWILIO_TO_NUMBER = os.getenv("TWILIO_TO_NUMBER", "")
