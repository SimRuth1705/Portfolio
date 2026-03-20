import initSqlJs from "sql.js";
import { promises as fs } from "fs";

const SQL = await initSqlJs();
let db;

async function loadOrCreate() {
  try {
    const filebuffer = await fs.readFile("data.sqlite");
    db = new SQL.Database(filebuffer);
  } catch {
    db = new SQL.Database();
  }
}

await loadOrCreate();

function persist() {
  const data = db.export();
  return fs.writeFile("data.sqlite", Buffer.from(data));
}

function exec(sql) {
  db.exec(sql);
}

function prepare(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  return stmt;
}

function all(sql, params = []) {
  const stmt = prepare(sql, params);
  const rows = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    rows.push(row);
  }
  stmt.free();
  return rows;
}

exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    repoLink TEXT,
    category TEXT
  );
  CREATE TABLE IF NOT EXISTS project_tech (
    project_id INTEGER,
    tech TEXT
  );
  CREATE TABLE IF NOT EXISTS project_detail (
    project_id INTEGER PRIMARY KEY,
    problem TEXT,
    techChoice TEXT,
    outcome TEXT
  );
  CREATE TABLE IF NOT EXISTS timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    title TEXT,
    description TEXT,
    type TEXT
  );
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT,
    name TEXT,
    role TEXT,
    avatar TEXT
  );
  CREATE TABLE IF NOT EXISTS devlogs (
    id INTEGER PRIMARY KEY,
    date TEXT,
    title TEXT,
    snippet TEXT
  );
  CREATE TABLE IF NOT EXISTS devlog_tags (
    devlog_id INTEGER,
    tag TEXT
  );
  CREATE TABLE IF NOT EXISTS content_edits (
    id TEXT PRIMARY KEY,
    content TEXT
  );
`);

function seedIfEmpty() {
  const projectCount = all("SELECT COUNT(*) as c FROM projects")[0]?.c || 0;
  if (projectCount === 0) {
    const projects = [
      {
        id: 1,
        title: "Pallet",
        description: "A high-end commerce engine.",
        image: "/api/placeholder/1200/800",
        repoLink: "#",
        category: "Commerce",
        tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
        detail: {
          problem:
            "Traditional e-commerce platforms suffer from bloated architectures and slow load times. Merchants needed a lightweight, customizable storefront that could handle high traffic without sacrificing user experience.",
          techChoice:
            "MongoDB was chosen over SQL for its flexible document model — perfect for variable product schemas (clothing vs. electronics). Combined with Node.js and Express for a non-blocking I/O layer that handles concurrent cart operations efficiently.",
          outcome:
            "Achieved sub-2s page loads with lazy-loaded product grids. Handled 100+ concurrent cart sessions during stress testing. Reduced checkout abandonment by 25% through a streamlined single-page flow.",
        },
      },
      {
        id: 2,
        title: "Vivahasya",
        description: "Enterprise-grade management dashboard.",
        image: "/api/placeholder/1200/800",
        repoLink: "#",
        category: "Enterprise",
        tech: ["React", "Node.js", "Tailwind CSS", "Framer Motion"],
        detail: {
          problem:
            "Wedding management businesses relied on fragmented tools — spreadsheets for leads, email for communication, and paper for bookings. They needed a unified command center to manage their entire pipeline.",
          techChoice:
            "React with Framer Motion delivers a fluid, app-like experience for the dashboard. Tailwind CSS enabled rapid UI iteration. The architecture was designed for real-time data flow with optimistic UI updates.",
          outcome:
            "Consolidated 4 separate tools into one dashboard. Reduced lead response time by 60%. Automated booking confirmations and follow-ups, saving 15+ hours per week for event coordinators.",
        },
      },
    ];
    const insertProject = prepare(
      "INSERT INTO projects (id, title, description, image, repoLink, category) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const insertTech = prepare(
      "INSERT INTO project_tech (project_id, tech) VALUES (?, ?)",
    );
    const insertDetail = prepare(
      "INSERT INTO project_detail (project_id, problem, techChoice, outcome) VALUES (?, ?, ?, ?)",
    );
    for (const p of projects) {
      insertProject.bind([
        p.id,
        p.title,
        p.description,
        p.image,
        p.repoLink,
        p.category,
      ]);
      insertProject.step();
      insertProject.reset();
      for (const t of p.tech) {
        insertTech.bind([p.id, t]);
        insertTech.step();
        insertTech.reset();
      }
      insertDetail.bind([
        p.id,
        p.detail.problem,
        p.detail.techChoice,
        p.detail.outcome,
      ]);
      insertDetail.step();
      insertDetail.reset();
    }
    insertProject.free();
    insertTech.free();
    insertDetail.free();
  }

  const timelineCount = all("SELECT COUNT(*) as c FROM timeline")[0]?.c || 0;
  if (timelineCount === 0) {
    const items = [
      {
        year: "2022",
        title: "Started BCA Program",
        description:
          "Began studying Bachelor of Computer Applications, diving into data structures, algorithms, and software fundamentals.",
        type: "education",
      },
      {
        year: "2023",
        title: "First Full-Stack Project",
        description:
          "Built Pallet — a complete e-commerce platform using the MERN stack. Learned production-level MongoDB design and React state management.",
        type: "milestone",
      },
      {
        year: "2023",
        title: "Open Source Contributions",
        description:
          "Started contributing to open source projects on GitHub, learning collaborative workflows and code review practices.",
        type: "milestone",
      },
      {
        year: "2024",
        title: "Vivahasya — Enterprise Dashboard",
        description:
          "Designed and built a wedding management CRM with real-time booking, lead tracking, and automated communications.",
        type: "project",
      },
      {
        year: "2025",
        title: "BCA Final Year & Portfolio Launch",
        description:
          "Final year of BCA. Launched this portfolio to showcase projects, skills, and the developer journey so far.",
        type: "education",
      },
    ];
    const insert = prepare(
      "INSERT INTO timeline (year, title, description, type) VALUES (?, ?, ?, ?)",
    );
    for (const i of items) {
      insert.bind([i.year, i.title, i.description, i.type]);
      insert.step();
      insert.reset();
    }
    insert.free();
  }

  const testimonialCount =
    all("SELECT COUNT(*) as c FROM testimonials")[0]?.c || 0;
  if (testimonialCount === 0) {
    const items = [
      {
        quote:
          "Samson's work on our platform exceeded expectations. The attention to detail and clean architecture made the codebase a joy to maintain.",
        name: "Arjun Mehta",
        role: "Project Lead, TechSprint",
        avatar: null,
      },
      {
        quote:
          "Fast, reliable, and creative. He turned our rough wireframes into a polished product in half the time we expected.",
        name: "Priya Sharma",
        role: "Co-Founder, EventFlow",
        avatar: null,
      },
      {
        quote:
          "His ability to debug complex issues and communicate solutions clearly sets him apart from other developers I've worked with.",
        name: "David Chen",
        role: "Senior Engineer, CodeLabs",
        avatar: null,
      },
    ];
    const insert = prepare(
      "INSERT INTO testimonials (quote, name, role, avatar) VALUES (?, ?, ?, ?)",
    );
    for (const t of items) {
      insert.bind([t.quote, t.name, t.role, t.avatar]);
      insert.step();
      insert.reset();
    }
    insert.free();
  }

  const devlogCount = all("SELECT COUNT(*) as c FROM devlogs")[0]?.c || 0;
  if (devlogCount === 0) {
    const items = [
      {
        id: 1,
        date: "2025-03-10",
        title: "Fixed CORS Nightmare on Render Deploy",
        snippet:
          "Spent 3 hours debugging 403 errors on production. Turned out Render was stripping custom headers. Fix: explicitly whitelist headers in Express CORS config.",
        tags: ["Node.js", "CORS", "Deploy"],
      },
      {
        id: 2,
        date: "2025-03-06",
        title: "SendGrid Migration from Resend",
        snippet:
          "Resend requires domain verification which wasn't possible on shared hosting. Switched to SendGrid with single-sender verification — emails working in 20 minutes.",
        tags: ["Email", "API", "Backend"],
      },
      {
        id: 3,
        date: "2025-02-28",
        title: "Framer Motion Layout Animations",
        snippet:
          "Discovered layoutId for shared element transitions. Used it for the project modal expand effect — goes from card position to fullscreen overlay smoothly.",
        tags: ["React", "Framer Motion", "UI"],
      },
      {
        id: 4,
        date: "2025-02-15",
        title: "MongoDB Aggregation Pipeline Optimization",
        snippet:
          "Dashboard queries were taking 800ms+. Rewrote with $lookup and $unwind pipeline stages. Down to 120ms. Index on createdAt sealed it.",
        tags: ["MongoDB", "Performance", "Backend"],
      },
    ];
    const insertLog = prepare(
      "INSERT INTO devlogs (id, date, title, snippet) VALUES (?, ?, ?, ?)",
    );
    const insertTag = prepare(
      "INSERT INTO devlog_tags (devlog_id, tag) VALUES (?, ?)",
    );
    for (const l of items) {
      insertLog.bind([l.id, l.date, l.title, l.snippet]);
      insertLog.step();
      insertLog.reset();
      for (const t of l.tags) {
        insertTag.bind([l.id, t]);
        insertTag.step();
        insertTag.reset();
      }
    }
    insertLog.free();
    insertTag.free();
  }
  return persist();
}

await seedIfEmpty();

export function getProjects() {
  const rows = all("SELECT * FROM projects ORDER BY id");
  const techRows = all("SELECT project_id, tech FROM project_tech");
  const detailRows = all("SELECT * FROM project_detail");
  const techMap = new Map();
  for (const r of techRows) {
    const list = techMap.get(r.project_id) || [];
    list.push(r.tech);
    techMap.set(r.project_id, list);
  }
  const detailMap = new Map(detailRows.map((d) => [d.project_id, d]));
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    repoLink: p.repoLink,
    category: p.category,
    tech: techMap.get(p.id) || [],
    detail: detailMap.get(p.id)
      ? {
          problem: detailMap.get(p.id).problem,
          techChoice: detailMap.get(p.id).techChoice,
          outcome: detailMap.get(p.id).outcome,
        }
      : null,
  }));
}

export function getTimeline() {
  return all("SELECT year, title, description, type FROM timeline");
}

export function getTestimonials() {
  return all("SELECT quote, name, role, avatar FROM testimonials");
}

export function getDevlogs() {
  const logs = all("SELECT * FROM devlogs ORDER BY id");
  const tagRows = all("SELECT devlog_id, tag FROM devlog_tags");
  const tagMap = new Map();
  for (const r of tagRows) {
    const list = tagMap.get(r.devlog_id) || [];
    list.push(r.tag);
    tagMap.set(r.devlog_id, list);
  }
  return logs.map((l) => ({ ...l, tags: tagMap.get(l.id) || [] }));
}

export function getContent(id) {
  const row = all("SELECT id, content FROM content_edits WHERE id = ?", [
    id,
  ])[0];
  return row || null;
}

export function upsertContent(id, content) {
  const exists =
    all("SELECT COUNT(*) as c FROM content_edits WHERE id = ?", [id])[0]?.c ||
    0;
  if (exists) {
    const stmt = prepare("UPDATE content_edits SET content = ? WHERE id = ?");
    stmt.bind([content, id]);
    stmt.step();
    stmt.free();
  } else {
    const stmt = prepare(
      "INSERT INTO content_edits (id, content) VALUES (?, ?)",
    );
    stmt.bind([id, content]);
    stmt.step();
    stmt.free();
  }
  return persist();
}
