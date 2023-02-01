// Globals -------------------------------------------------------------------
const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuidv4 } = require('uuid');

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
    newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("An error occurred!");
            throw err;
        } else {
            const notesData = JSON.parse(data);
            notesData.push(newNote);
            fs.writeFile("./db/db.json", JSON.stringify(notesData, null, 4), (err) => {
                if (err) {
                    res.status(500).send("An error occurred!");
                    throw err;
                }
            });
        }
    });
    res.send(newNote);
});

// BONUS route for DELETE functionality.
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("An error occurred!");
            throw err;
        } else {
            let notesData = JSON.parse(data);
            notesData = notesData.filter((note) => {
                if (note.id == req.params.id) {
                    return false;
                } else {
                    return true;
                }
            });
            fs.writeFile("./db/db.json", JSON.stringify(notesData, null, 4), (err) => {
                if (err) {
                    res.status(500).send("An error occurred!");
                    throw err;
                } else{
                    res.status(200).send("Note deleted.");
                }
            });
        }
    });
});

// Wildcard route retrieves index.hml.
app.get('/*', (req, res) => {
    res.sendFile(path.join(path.join(__dirname, '/public/index.html')))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
