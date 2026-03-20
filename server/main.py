from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import FRONTEND_URL
from app.seeder import seed_data
from app.routes import auth, skills, projects, timeline, testimonials, devlogs, content, contact, about, vault, upload, settings

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Samson Portfolio API")

# Ensure static directory exists
os.makedirs("static/uploads", exist_ok=True)

# Mount Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://samsonraj.vercel.app",
        "https://www.samsonraj.in",
        "https://samsonraj.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(settings.router)
app.include_router(skills.router)
app.include_router(projects.router)
app.include_router(timeline.router)
app.include_router(testimonials.router)
app.include_router(devlogs.router)
app.include_router(content.router)
app.include_router(contact.router)
app.include_router(about.router)
app.include_router(vault.router)
app.include_router(upload.router)

@app.get("/")
async def root():
    return {"status": "online", "message": "Samson Portfolio API is active"}

@app.on_event("startup")
async def startup_event():
    seed_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5006, reload=True)
