onst express = require('express');
const cors = require('cors');

const db = require('./database');

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;


// route to get all the notes from the database
app.get('/notes', (req, res) => {

  // query to get everything from notes table
  db.all('SELECT * FROM notes', [], (err, rows) => {

    if (err) {
      // print the error and send back a message
      console.error(err.message);

      
      res.status(500).json({ error: 'something went wrong getting notes' });
    } else {
      // send the notes back as json
      res.json(rows);
    }

  });

});


// route to add a new note
app.post('/notes', (req, res) => {

  const content = req.body.content;

  // check that the note actually has something in it
  if (!content || content.trim() === '') 
  {
    return res.status(400).json({ error: 'note cant be empty' });
  }

  // insert the note into the database
  db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {

    if (err) {
      console.error(err.message);

      
      res.status(500).json({ error: 'something went wrong saving the note' });

      
    } else {
      // send back the new note with its id
      res.json({ id: this.lastID, content: content });
    }

  });

});




// route to delete a note by its id
app.delete('/notes/:id', (req, res) => {

  // grab the id from the url
  
  const id = req.params.id;

  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {

    if (err) 
    
    
    {
      console.error(err.message);
      res.status(500).json({ error: 'something went wrong deleting the note' });
    } else {
      res.send('note deleted');
    }

  });

});


// start the server
app.listen(PORT, () => {
  console.log('server running on port 3000');
});
