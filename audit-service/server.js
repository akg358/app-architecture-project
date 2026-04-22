const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./audit.db');

db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/log', (req, res) => {
  const { user_id = null, action, resource_type = null, resource_id = null, details = null } = req.body;
  if (!action) return res.status(400).json({ error: 'action is required' });

  db.run(
    'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
    [user_id, action, resource_type, resource_id, details],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.get('/', (req, res) => {
  const { action, resource_type, user_id, limit = 100 } = req.query;

  const where = [];
  const params = [];

  if (action) {
    where.push('action = ?');
    params.push(action);
  }
  if (resource_type) {
    where.push('resource_type = ?');
    params.push(resource_type);
  }
  if (user_id) {
    where.push('user_id = ?');
    params.push(user_id);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  params.push(Number(limit));

  db.all(
    `SELECT id, user_id, action, resource_type, resource_id, details, created_at
     FROM audit_logs ${whereClause}
     ORDER BY id DESC
     LIMIT ?`,
    params,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get('/stats/summary', (_req, res) => {
  db.get(
    `SELECT COUNT(*) as total_logs,
            COUNT(DISTINCT user_id) as unique_users,
            COUNT(DISTINCT action) as unique_actions,
            COUNT(DISTINCT resource_type) as unique_resource_types
     FROM audit_logs`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

app.get('/stats/actions', (_req, res) => {
  db.all(
    `SELECT action, COUNT(*) as count
     FROM audit_logs
     GROUP BY action
     ORDER BY count DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get('/:id', (req, res) => {
  db.get(
    `SELECT id, user_id, action, resource_type, resource_id, details, created_at
     FROM audit_logs
     WHERE id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    }
  );
});

app.listen(PORT, () => console.log(`Audit Service on ${PORT}`));
