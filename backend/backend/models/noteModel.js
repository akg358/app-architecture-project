const db = require('../database');

function getAllNotes(callback)
{
  db.all('SELECT * FROM notes', [], callback);
}

function createNote(content, callback)
{
  db.run('INSERT INTO notes (content) VALUES (?)', [content], callback);
}

function deleteNote(id, callback)
{
  db.run('DELETE FROM notes WHERE id = ?', [id], callback);
}

module.exports = {
  getAllNotes,
  createNote,
  deleteNote
};
