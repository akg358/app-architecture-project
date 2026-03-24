const db = require('../database');

const noteRepository = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM notes', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    create: (content) => {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, content });
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

module.exports = noteRepository;
