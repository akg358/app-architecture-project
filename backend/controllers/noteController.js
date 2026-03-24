const noteModel = require('../models/noteModel');

function listNotes(req, res)
{
  noteModel.getAllNotes((err, rows) =>
  {
    if (err)
    {
      return res.status(500).send(err.message);
    }

    return res.json(rows);
  });
}

function addNote(req, res)
{
  const content = req.body.content;

  noteModel.createNote(content, function(err)
  {
    if (err)
    {
      return res.status(500).send(err.message);
    }

    return res.json({
      id: this.lastID,
      content
    });
  });
}

function removeNote(req, res)
{
  const id = req.params.id;

  noteModel.deleteNote(id, (err) =>
  {
    if (err)
    {
      return res.status(500).send(err.message);
    }

    return res.send('note deleted');
  });
}

module.exports = {
  listNotes,
  addNote,
  removeNote
};
