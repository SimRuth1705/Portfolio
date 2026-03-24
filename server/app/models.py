from pydantic import BaseModel
from typing import List, Optional

class LoginIn(BaseModel):
    password: str

class SkillIn(BaseModel):
    name: str
    category: str

class ProjectIn(BaseModel):
    title: str
    description: str
    tags: List[str]
    image: str
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    problem: Optional[str] = None
    tech_choice: Optional[str] = None
    outcome: Optional[str] = None
    category: Optional[str] = "Project"

class TimelineIn(BaseModel):
    year: str
    title: str
    description: str
    type: str

class TestimonialIn(BaseModel):
    quote: str
    name: str
    role: str
    avatar: Optional[str] = None

class DevlogIn(BaseModel):
    title: str
    snippet: str
    content: str
    tags: List[str]

class ContentIn(BaseModel):
    section: Optional[str] = None
    content: str

class ContactIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

# Output Models
class SkillOut(BaseModel):
    id: str
    name: str
    category: str

class ProjectOut(BaseModel):
    id: str
    title: str
    description: str
    tags: List[str]
    image: str
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    problem: Optional[str] = None
    tech_choice: Optional[str] = None
    outcome: Optional[str] = None
    category: Optional[str] = "Project"

class TimelineOut(BaseModel):
    id: str
    year: str
    title: str
    description: str
    type: str

class TestimonialOut(BaseModel):
    id: str
    quote: str
    name: str
    role: str
    avatar: Optional[str] = None

class DevlogOut(BaseModel):
    id: str
    title: str
    snippet: str
    content: str
    tags: List[str]
    created_at: Optional[str] = None

class ContentOut(BaseModel):
    id: str
    section: str
    content: str

class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: str

class SettingsIn(BaseModel):
    key: str
    value: str

class SettingsOut(BaseModel):
    key: str
    value: str
