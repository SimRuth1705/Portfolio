from datetime import datetime, timezone
from bson import ObjectId
from app.database import db

def seed_data():
    try:
        if db.projects.count_documents({}) == 0:
            db.projects.insert_one({
                "title": "Pallet",
                "description": "A full-stack portfolio application built with MERN stack",
                "tech": ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
                "tags": ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
                "image": "/images/hero.png",
                "category": "Full Stack",
                "live_url": "https://portfolio.example.com",
                "repoLink": "https://github.com/samsonraj/mern-portfolio",
                "github_url": "https://github.com/samsonraj/mern-portfolio",
            })
        if db.timeline.count_documents({}) == 0:
            db.timeline.insert_many([
                {"year": "2024", "title": "Started MERN Portfolio", "description": "Began development of portfolio application using MERN stack", "type": "project"},
                {"year": "2024", "title": "Deployed to Production", "description": "Successfully deployed MERN portfolio to production environment", "type": "milestone"},
            ])
        if db.testimonials.count_documents({}) == 0:
            db.testimonials.insert_many([
                {"quote": "Excellent MERN developer who delivered a stunning portfolio application", "name": "John Doe", "role": "Tech Lead"},
                {"quote": "Impressive full-stack development skills with modern MERN technologies", "name": "Jane Smith", "role": "Senior Developer"},
            ])
        if db.devlogs.count_documents({}) == 0:
            now = datetime.now(timezone.utc).isoformat()
            db.devlogs.insert_many([
                {"title": "MERN Stack Setup", "snippet": "Configured MongoDB, Express, React, Node.js development environment", "content": "Set up complete MERN development environment.", "tags": ["MERN", "MongoDB", "Express", "React", "Node.js"], "created_at": now},
                {"title": "API Development", "snippet": "Built RESTful APIs with Express and MongoDB", "content": "Developed comprehensive RESTful API endpoints.", "tags": ["API", "Express", "MongoDB", "REST"], "created_at": now},
            ])
        if db.skills.count_documents({}) == 0:
            row1 = ["React", "Node.js", "JavaScript", "Python", "MongoDB", "Tailwind CSS"]
            row2 = ["HTML", "CSS", "EJS", "Git", "GitHub", "MySQL", "Express"]
            db.skills.insert_many(
                [{"name": n, "category": "Technical Skills Row 1"} for n in row1] +
                [{"name": n, "category": "Technical Skills Row 2"} for n in row2]
            )
        
        # Always seed content to ensure all keys are present
        db.content.delete_many({})
        db.content.insert_many([
            {"section": "nav_logo_text", "content": "SAMSON"},
            {"section": "nav_logo_sub", "content": "PORTFOLIO"},
            {"section": "hero_badge", "content": "AVAILABLE FOR WORK"},
            {"section": "hero_fname", "content": "SAMSON"},
            {"section": "hero_lname", "content": "RAJ"},
            {"section": "hero_role", "content": "MERN STACK DEVELOPER"},
            {"section": "hero_desc", "content": "I build robust, scalable, and visually stunning web applications using the MERN stack. Focused on clean code and exceptional user experiences."},
            {"section": "about_status", "content": "PERSONAL BACKGROUND"},
            {"section": "about_title", "content": "ABOUT"},
            {"section": "skills_title", "content": "TECHNICAL SKILLS"},
            {"section": "skills_status", "content": "ENGINE CAPABILITIES"},
            {"section": "skills_hint", "content": "INTERACTIVE STREAM V1.0"},
            {"section": "timeline_title", "content": "EXPERIENCE"},
            {"section": "timeline_status", "content": "My Professional Journey"},
            {"section": "projects_title", "content": "PROJECTS"},
            {"section": "projects_status", "content": "My Recent Work"},
            {"section": "devlog_title", "content": "DEVLOGS"},
            {"section": "devlog_status", "content": "Thoughts & Tutorials"},
            {"section": "testimonials_title", "content": "CLIENT FEEDBACK"},
            {"section": "testimonials_status", "content": "What others say about my work"},
            {"section": "lab_title", "content": "THE LABORATORY"},
            {"section": "lab_status", "content": "Experimental Projects & Prototypes"},
            {"section": "lab_1_title", "content": "Glassmorphism Card"},
            {"section": "lab_1_desc", "content": "A pure CSS glassmorphism card with animated gradient border and frosted backdrop."},
            {"section": "lab_2_title", "content": "Infinite Marquee"},
            {"section": "lab_2_desc", "content": "Smooth infinite scroll text ticker using CSS keyframes. Zero JavaScript."},
            {"section": "lab_3_title", "content": "Magnetic Cursor"},
            {"section": "lab_3_desc", "content": "Physics-based cursor follower that magnetically attracts to interactive elements."},
            {"section": "lab_4_title", "content": "Noise Grain Overlay"},
            {"section": "lab_4_desc", "content": "SVG-based film grain effect that adds analog texture to modern web designs."},
            {"section": "specs_title", "content": "SETUP"},
            {"section": "specs_status", "content": "HARDWARE & SOFTWARE"},
            {"section": "spec_machine", "content": "Windows 11 — Ryzen 5"},
            {"section": "spec_editor", "content": "VS Code — Gruvbox Theme"},
            {"section": "spec_terminal", "content": "Windows Terminal + Git Bash"},
            {"section": "spec_design", "content": "Figma + Framer"},
            {"section": "spec_stack", "content": "React / Node / MongoDB"},
            {"section": "spec_deploy", "content": "Vercel + Render"},
            {"section": "github_title", "content": "GITHUB STATUS"},
            {"section": "github_status", "content": "Open Source Activity"},
            {"section": "github_username", "content": "SimRuth1705"},
            {"section": "contact_title", "content": "START A PROJECT."},
            {"section": "contact_status", "content": "TRANSMISSION PORTAL"},
            {"section": "contact_headline", "content": "Have a vision? Let's decode the path together."},
            {"section": "contact_label_email", "content": "Email"},
            {"section": "contact_value_email", "content": "samsonraj74@gmail.com"},
            {"section": "contact_label_phone", "content": "Phone"},
            {"section": "api_title", "content": "API STATUS"},
            {"section": "api_status_label", "content": "LIVE INFRASTRUCTURE"},
            {"section": "footer_copyright", "content": "SAMSON RAJ N."},
            {"section": "footer_tagline", "content": "CRAFTING DIGITAL ARCHITECTURE"},
            {"section": "footer_location", "content": "TAMIL NADU, INDIA"},
            {"section": "footer_status", "content": "OPEN FOR GLOBAL COLLABORATION"},
            {"section": "about_bio", "content": "Crafting digital experiences with precision and passion. I specialize in building scalable web applications and intuitive user interfaces."},
            {"section": "about_email", "content": "samsonraj74@gmail.com"},
            {"section": "about_phone", "content": "+91 88254 70047"},
            {"section": "about_location", "content": "Tamil Nadu, India"},
        ])
        print("Database seeded")
    except Exception as e:
        print(f"Error seeding data: {e}")
