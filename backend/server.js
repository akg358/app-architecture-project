// import express library
const express = require('express');


// import cors library
const cors = require('cors');


// import database
const db = require('./database');


// create express app
const app = express();


// enable cors
app.use(cors());


// enable json parsing
app.use(express.json());


// define port
const PORT = 3000;



// create route to get notes
app.get('/notes', (req, res) =>
{

  // run sql query
  db.all(

    // select all notes
    'SELECT * FROM notes',

    // no parameters needed
    [],

    // function after query
    (err, rows) =>
    {

      // check for error
      if (err)
      {

        // send error
        res.status(500).send(err.message);

      }

      // run if successful
      else
      {

        // send notes
        res.json(rows);

      }

    }

  );

});



// create route to add note
app.post('/notes', (req, res) =>
{

  // get content
  const content = req.body.content;


  // run insert query
  db.run(

    // insert note
    'INSERT INTO notes (content) VALUES (?)',

    // pass content
    [content],

    // function after insert
    function(err)
    {

      // check for error
      if (err)
      {

        // send error
        res.status(500).send(err.message);

      }

      // run if successful
      else
      {

        // send new note
        res.json(

          {

            // send id
            id: this.lastID,

            // send content
            content: content

          }

        );

      }

    }

  );

});



// create route to delete note
app.delete('/notes/:id', (req, res) =>
{

  // get id
  const id = req.params.id;


  // run delete query
  db.run(

    // delete note sql
    'DELETE FROM notes WHERE id = ?',

    // pass id
    [id],

    // function after delete
    function(err)
    {

      // check for error
      if (err)
      {

        // send error
        res.status(500).send(err.message);

      }

      // run if successful
      else
      {

        // send confirmation
        res.send('note deleted');

      }

    }

  );

});



// start server
app.listen(PORT, () =>
{

  // print message
  console.log('server running on port 3000');

});
