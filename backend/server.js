// import express library
const express = require('express');


// import cors library
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');


// create express app
const app = express();
const PORT = 3000;


// enable cors
app.use(cors());


// enable json parsing
app.use(express.json());
app.use(noteRoutes);



// start server
app.listen(PORT, () =>
{

  // print message
  console.log('server running on port 3000');

});
