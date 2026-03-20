import express from 'express';
import cors from 'cors';
import { getProjects, getTimeline, getTestimonials, getDevlogs, getContent, upsertContent } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/projects', (req, res) => {
  res.json(getProjects());
});

app.get('/api/timeline', (req, res) => {
  res.json(getTimeline());
});

app.get('/api/testimonials', (req, res) => {
  res.json(getTestimonials());
});

app.get('/api/devlogs', (req, res) => {
  res.json(getDevlogs());
});

app.get('/api/content/:id', (req, res) => {
  const row = getContent(req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Not found' });
    return;
    }
  res.json(row);
});

app.put('/api/content/:id', (req, res) => {
  const { content } = req.body || {};
  if (typeof content !== 'string') {
    res.status(400).json({ error: 'content must be a string' });
    return;
  }
  upsertContent(req.params.id, content);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  process.stdout.write(`Server running on http://localhost:${PORT}\n`);
});
