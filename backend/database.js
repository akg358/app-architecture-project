// import sqlite3 so we can use a database
const sqlite3 = require('sqlite3').verbose();


// create or open the database file
const db = new sqlite3.Database('./notes.db', (err) =>
{

  // check if connection failed
  if (err)
  {

    // print error message
    console.error(err.message);

  }

  // run if connection successful
  else
  {

    // print success message
    console.log('database connected');

  }

});


// create notes table if it does not exist
db.run(
`
CREATE TABLE IF NOT EXISTS notes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
content TEXT NOT NULL
)
`
);


// export database
module.exports = db;
