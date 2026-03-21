const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 👇 Static folder (frontend files)
app.use(express.static(path.join(__dirname, 'public')));

// 👇 Default route → login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 👇 MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'disaster_db'
});

db.connect(err => {
    if (err) {
        console.error('DB Error: ' + err.stack);
        return;
    }
    console.log('MySQL Connected!');
});

// ===================== LOGIN =====================
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const fixedEmail = "admin@gmail.com";
    const fixedPassword = "admin@123";

    if (email === fixedEmail && password === fixedPassword) {
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid Email or Password" });
    }
});

// ===================== SUBMIT REPORT =====================
app.post('/submit-report', (req, res) => {
    const { fullname, mobile, disasterType, location, datetime, description } = req.body;

    const sql = `
        INSERT INTO reports 
        (fullname, mobile, disasterType, location, datetime, description) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [fullname, mobile, disasterType, location, datetime, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ status: 'Success' });
    });
});

// ===================== GET REPORTS =====================
app.get('/get-reports', (req, res) => {
    db.query("SELECT * FROM reports ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ===================== USERS =====================
app.get('/get-users', (req, res) => {
    const sql = "SELECT fullname, mobile, location FROM reports GROUP BY mobile";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ===================== LOGS =====================
app.get('/get-logs', (req, res) => {
    const sql = "SELECT fullname, mobile, location, datetime FROM reports ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ===================== SERVER =====================
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});