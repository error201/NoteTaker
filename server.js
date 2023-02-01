// Globals -------------------------------------------------------------------
const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Routes --------------------------------------------------------------------
// GET request for ALL NOTES.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// GET /api/notes route. Should return /db/db.json as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("An error occurred!");
            throw err;
        } else {
            const notesData = JSON.parse(data);
            res.json(notesData);
        }
    });
});

// POST /api/notes route. Should take sent note and add it to the dn.json file. 
app.post('/api/notes', (req, res) => {
    console.log(req.body)
});

// BONUS route for DELETE functionality.
app.delete('/api/notes/:note_id', (req, res) => {
    console.log(`Received DELETE request for /api/notes/${req.params.note_id}.`);
});

// Wildcard route retrieves index.hml.
app.get('/*', (req, res) => {
    console.log("Routed to wildcard.")
    res.sendFile(path.join(path.join(__dirname, '/public/index.html')))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
