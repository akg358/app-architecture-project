const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/notes', noteController.getNotes);
router.post('/notes', noteController.addNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;
