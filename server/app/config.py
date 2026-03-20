import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/portfolio")
JWT_SECRET = os.getenv("JWT_SECRET", "changeme-set-JWT_SECRET-in-env")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
