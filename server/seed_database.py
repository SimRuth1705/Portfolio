from app.database import db
from bson import ObjectId

def clear_and_seed():
    print("Clearing collections...")
    db.projects.delete_many({})
    db.testimonials.delete_many({})
    db.timeline.delete_many({})
    db.devlogs.delete_many({})
    db.skills.delete_many({})
    db.about_skills.delete_many({})
    db.about_soft_skills.delete_many({})
    db.content.delete_many({})

    print("Seeding Projects...")
    db.projects.insert_many([
        {
            "title": "Samson AI Portfolio",
            "description": "A high-performance personal portfolio built with React, FastAPI, and MongoDB, featuring real-time content management.",
            "tags": ["React", "FastAPI", "MongoDB", "Tailwind"],
            "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
            "live_url": "https://portfolio.samson.com",
            "github_url": "https://github.com/SamsonRaj/portfolio"
        },
        {
            "title": "Vault Admin Dashboard",
            "description": "A secure administrative interface for managing portfolio content, featuring JWT authentication and file uploads.",
            "tags": ["Python", "JWT", "Modern UI"],
            "image": "https://images.unsplash.com/photo-1551288049-bb848a55a110",
            "live_url": "https://vault.samson.com",
            "github_url": "https://github.com/SamsonRaj/vault"
        }
    ])

    print("Seeding Testimonials...")
    db.testimonials.insert_many([
        {
            "name": "Sarah Chen",
            "role": "Senior Developer at TechFlow",
            "quote": "Samson's attention to detail and ability to bridge the gap between frontend and backend is exceptional. A true full-stack talent.",
            "avatar": "https://i.pravatar.cc/150?u=sarah"
        },
        {
            "name": "Marcus Rodriguez",
            "role": "Founder of StartupX",
            "quote": "Building our MVP with Samson was a seamless experience. Fast, clean code and great communication.",
            "avatar": "https://i.pravatar.cc/150?u=marcus"
        }
    ])

    print("Seeding Timeline...")
    db.timeline.insert_many([
        {
            "year": "2024",
            "title": "Lead Full-Stack Developer",
            "description": "Currently leading technical architecture for multiple high-impact web applications.",
            "type": "work"
        },
        {
            "year": "2023",
            "title": "Full Stack Certification",
            "description": "Completed advanced certification in modern web technologies and cloud infrastructure.",
            "type": "education"
        }
    ])

    print("Seeding DevLogs...")
    db.devlogs.insert_many([
        {
            "title": "Optimizing MongoDB Queries",
            "snippet": "How I reduced API latency by 40% using proper indexing and aggregation pipelines.",
            "content": "Full post content here...",
            "tags": ["Backend", "Performance", "MongoDB"]
        },
        {
            "title": "Mastering Framer Motion",
            "snippet": "Exploring complex entry/exit animations for a more fluid user experience.",
            "content": "Full post content here...",
            "tags": ["Frontend", "Animation", "UI/UX"]
        }
    ])

    print("Seeding Technical Skills (Carousel)...")
    db.skills.insert_many([
        {"name": "React", "category": "Technical Skills Row 1"},
        {"name": "Node.js", "category": "Technical Skills Row 1"},
        {"name": "JavaScript", "category": "Technical Skills Row 1"},
        {"name": "Python", "category": "Technical Skills Row 1"},
        {"name": "MongoDB", "category": "Technical Skills Row 1"},
        {"name": "Tailwind CSS", "category": "Technical Skills Row 1"},
        {"name": "HTML", "category": "Technical Skills Row 2"},
        {"name": "CSS", "category": "Technical Skills Row 2"},
        {"name": "EJS", "category": "Technical Skills Row 2"},
        {"name": "Git", "category": "Technical Skills Row 2"},
        {"name": "GitHub", "category": "Technical Skills Row 2"},
        {"name": "MySQL", "category": "Technical Skills Row 2"},
        {"name": "Express", "category": "Technical Skills Row 2"}
    ])

    print("Seeding About Skills...")
    db.about_skills.insert_many([
        {"category": "Web Technologies", "items": ["React", "Next.js", "Node.js", "Express", "FastAPI"]},
        {"category": "Database & Infrastructure", "items": ["MongoDB", "PostgreSQL", "Docker", "AWS", "Nginx"]},
        {"category": "Programming Languages", "items": ["JavaScript", "TypeScript", "Python", "C++"]}
    ])

    print("Seeding Soft Skills...")
    db.about_soft_skills.insert_many([
        {"title": "Leadership", "description": "Proven ability to guide teams and manage complex project timelines efficiently."},
        {"title": "Communication", "description": "Expert at translating complex technical requirements for non-technical stakeholders."},
        {"title": "Problem Solving", "description": "A methodical approach to debugging and architectural design."}
    ])

    print("Seeding Global Content...")
    db.content.insert_many([
        {"section": "hero_badge", "content": "SYS.READY"},
        {"section": "hero_fname", "content": "SAMSON"},
        {"section": "hero_lname", "content": "RAJ N."},
        {"section": "hero_role", "content": "Developer × Problem Solver"},
        {"section": "nav_logo_text", "content": "SAMSON"},
        {"section": "nav_logo_sub", "content": "PORTFOLIO_v1.0"},
        {"section": "projects_status", "content": "Selected Works"},
        {"section": "projects_title", "content": "PROJECTS"},
        {"section": "testimonials_status", "content": "Trust Signals"},
        {"section": "testimonials_title", "content": "VOICES"},
        {"section": "timeline_status", "content": "System History"},
        {"section": "timeline_title", "content": "Timeline"},
        {"section": "devlog_status", "content": "Dev Stream"},
        {"section": "devlog_title", "content": "DEVLOG"},
        {"section": "skills_status", "content": "Engine Capabilities"},
        {"section": "skills_title", "content": "SKILLS"},
        {"section": "skills_hint", "content": "Interactive Stream v1.0"},
        {"section": "github_status", "content": "Live Metrics"},
        {"section": "github_title", "content": "GITHUB FEED"},
        {"section": "github_username", "content": "SimRuth1705"},
        {"section": "lab_status", "content": "R&D Department"},
        {"section": "lab_title", "content": "TECH_LAB"},
        {"section": "lab_1_title", "content": "NEURAL_NET"},
        {"section": "lab_1_desc", "content": "Advanced machine learning modules for data processing."},
        {"section": "lab_2_title", "content": "GRID_SYSTEM"},
        {"section": "lab_2_desc", "content": "Distributed infrastructure for high-availability apps."},
        {"section": "lab_3_title", "content": "ENIGMA_PROTOCOL"},
        {"section": "lab_3_desc", "content": "Secure communication and encryption algorithms."},
        {"section": "lab_4_title", "content": "QUANTUM_UI"},
        {"section": "lab_4_desc", "content": "Next-gen user interface components and animations."},
        {"section": "specs_status", "content": "Internal Hardware"},
        {"section": "specs_title", "content": "SPECIFICATIONS"},
        {"section": "spec_machine", "content": "Custom Build v3.0"},
        {"section": "spec_editor", "content": "VS Code / VIM"},
        {"section": "spec_terminal", "content": "Warp / iTerm2"},
        {"section": "spec_design", "content": "Figma / Adobe Suite"},
        {"section": "spec_stack", "content": "MERN / Python"},
        {"section": "spec_deploy", "content": "Docker / AWS"},
        {"section": "api_status_label", "content": "System Integration"},
        {"section": "api_title", "content": "EXTENSIONS"},
        {"section": "contact_status", "content": "Ready for Sync"},
        {"section": "contact_title", "content": "CONTACT"},
        {"section": "contact_headline", "content": "ESTABLISH CONNECTION"},
        {"section": "contact_label_email", "content": "SECURE_MAIL"},
        {"section": "contact_value_email", "content": "samson@developer.com"},
        {"section": "contact_label_phone", "content": "DIRECT_LINE"},
        {"section": "footer_status", "content": "System Terminated"},
        {"section": "footer_location", "content": "Bangalore, India"},
        {"section": "footer_tagline", "content": "Built with passion & precision."},
        {"section": "footer_copyright", "content": "© 2024 SAMSON_PORTFOLIO"},
        {"section": "about_status", "content": "Personal Background"},
        {"section": "about_title", "content": "ABOUT"},
        {"section": "about_bio", "content": "Crafting digital experiences with precision and passion. I specialize in building scalable web applications and intuitive user interfaces that bridge the gap between complex logic and human interaction."},
        {"section": "about_email", "content": "samson@example.com"},
        {"section": "about_phone", "content": "+91 98765 43210"},
        {"section": "about_location", "content": "Tamil Nadu, India"}
    ])

    print("Seeding complete!")

if __name__ == "__main__":
    clear_and_seed()
