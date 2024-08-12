const express=require('express');
const sql=require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app=express();

app.use(express.json());
app.use(cors());

const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL Connected...');
    }
});

app.get('/flashcards', (req, res) => {
    const query = 'SELECT * FROM flashcard';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch flashcards' });
        } else {
            res.json(results);
        }
    });
});
app.post('/flashcards', (req, res) => {
    const { question, answer } = req.body;
    const query = 'INSERT INTO flashcard (question, answer) VALUES (?, ?)';
    db.query(query, [question, answer], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to add flashcard' });
        } else {
            res.json({ message: 'Flashcard added successfully', id: results.insertId });
        }
    });
});
app.put('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.query('UPDATE flashcard SET question = ?, answer = ? WHERE id = ?', [question, answer, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to update flashcard' });
        } else {
            res.json({ message: 'Flashcard updated successfully', id: result.insertId });
        }
    });
});

app.delete('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM flashcard WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete flashcard' });
        } else {
            res.json({ message: 'Flashcard deleted successfully', id: result.insertId });
        }
    });
});


const port=5000;
app.listen(port, () => console.log('Server is running'));