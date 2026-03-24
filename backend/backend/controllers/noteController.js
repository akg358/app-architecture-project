const noteService = require('../services/noteService');

const noteController = {
    getNotes: async (req, res) => {
        try {
            const notes = await noteService.getAllNotes();
            res.json(notes);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    addNote: async (req, res) => {
        try {
            const newNote = await noteService.createNote(req.body.content);
            res.json(newNote);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteNote: async (req, res) => {
        try {
            await noteService.deleteNoteById(req.params.id);
            res.send('note deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = noteController;
