// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Povezivanje s MySQL bazom
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
});

// CRUD operacija za unos podataka
app.post('/addUser', (req, res) => {
    const { firstName, lastName, address, birthDate, phoneNumber, username, password } = req.body;
    pool.query('INSERT INTO users SET ?', { firstName, lastName, address, birthDate, phoneNumber, username, password }, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: 'User added successfully', userId: results.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
