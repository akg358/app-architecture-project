const noteRepository = require('../data/noteRepository');

const noteService = {
    getAllNotes: async () => {
        return await noteRepository.findAll();
    },

    createNote: async (content) => {
        if (!content) throw new Error('Content required');
        return await noteRepository.create(content);
    },

    deleteNoteById: async (id) => {
        return await noteRepository.delete(id);
    }
};

module.exports = noteService;
