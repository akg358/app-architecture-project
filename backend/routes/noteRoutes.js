const express = require('express');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.get('/notes', noteController.listNotes);
router.post('/notes', noteController.addNote);
router.delete('/notes/:id', noteController.removeNote);

module.exports = router;
