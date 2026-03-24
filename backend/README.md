# Notes App - Monolithic Architecture

## What is monolithic architecture

Monolithic architecture means the whole application runs as one single unnit. All the
backend code like the routes, the logic, and the database calls are all together in
one files (server.js) instead of being split up into separate services or layers. Its
the simplest way to build an app like this.

## How to run it

go into the backend folder first

cd backend
npm install
node server.js

then open frontend/index.html in your browser. backend runs on port 3000.

## API routes

- GET /notes - returns all the notes
- POST /notes - adds a new note, needs content in the request body
- DELETE /notes/:id - deletes the note with that id

## Files

- server.js - has all the routes and handles requests
- database.js - sets up the sqlite database connection
- frontend/index.html - the frontend, just a basic html page