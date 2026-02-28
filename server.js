const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'disaster_db'
});

db.connect(err => {
    if (err) { console.error('Error connecting: ' + err.stack); return; }
    console.log('MySQL Connected!');
});

// User kadun data ghenyasathi (POST)
app.post('/submit-report', (req, res) => {
    const { fullname, mobile, disasterType, location, datetime, description } = req.body;
    const sql = "INSERT INTO reports (fullname, mobile, disasterType, location, datetime, description) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [fullname, mobile, disasterType, location, datetime, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ status: 'Success' });
    });
});

// Admin Panel la data pathvanyasathi (GET)
app.get('/get-reports', (req, res) => {
    db.query("SELECT * FROM reports ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log('Server chalu jhala: http://localhost:3000'));
// User chi list milvanyasathi (GET)
app.get('/get-users', (req, res) => {
    // Reports table madhun fakt Name, Mobile ani Location ghyayche
    const sql = "SELECT fullname, mobile, location FROM reports GROUP BY mobile"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
// Logs milvanyasathi (GET API)
app.get('/get-logs', (req, res) => {
    // Sarva reports chi list id nusar dakhva (Latest first)
    const sql = "SELECT fullname, mobile, location, datetime FROM reports ORDER BY id DESC"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});