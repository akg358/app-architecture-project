const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./notes.db');

db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/', (req, res) => {
  const { user_id } = req.query;
  const sql = user_id
    ? 'SELECT id, content, user_id, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY id DESC'
    : 'SELECT id, content, user_id, created_at, updated_at FROM notes ORDER BY id DESC';
  const params = user_id ? [user_id] : [];

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/:id', (req, res) => {
  db.get(
    'SELECT id, content, user_id, created_at, updated_at FROM notes WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    }
  );
});

app.post('/', (req, res) => {
  const { content, user_id = null } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });

  db.run(
    'INSERT INTO notes (content, user_id) VALUES (?, ?)',
    [content, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, content, user_id });
    }
  );
});

app.put('/:id', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });

  db.run(
    'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [content, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ id: Number(req.params.id), content });
    }
  );
});

app.delete('/:id', (req, res) => {
  db.run('DELETE FROM notes WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'note deleted' });
  });
});

app.listen(PORT, () => console.log(`Note Service on ${PORT}`));
