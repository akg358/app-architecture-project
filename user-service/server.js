const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./users.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/', (req, res) => {
    db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/', (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: 'Required' });
    db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, username, email });
    });
});

app.listen(PORT, () => console.log(`User Service on ${PORT}`));
