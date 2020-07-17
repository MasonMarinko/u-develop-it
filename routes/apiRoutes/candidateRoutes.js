const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');


// Delete a candidate
router.delete('/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                error: res.message
            });
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// Create a candidate
router.post('/candidates', ({
    body
}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({
            error: errors
        });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function, not arrow function, to use `this`
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

// GET a single candidate HARD coded the 1 in order to test
router.get('/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates
                WHERE id  = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// GET all candidates
// check to see if we can receive all the candidates
router.get('/candidates', (req, res) => {
    const sql = 'SELECT * FROM candidates';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });

});

module.exports = router;