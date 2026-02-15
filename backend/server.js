const express = require('express');
const app = express();

const notes = [" notes for english ", "notes for math"];

app.use(express.json());

app.get('/notes', (req, res) =>
{
    res.json(notes);
});

app.post('/notes', (req, res) =>
{
    const note = req.body.note;

    if (note)
    {
        notes.push(note);
        res.status(201).send({ message: "Note added" });
    }
    else
    {
        res.status(400).send({ message: "No note provided" });
    }
});

app.listen(3000, () =>
{
    console.log('Server running on http://localhost:3000');
});
