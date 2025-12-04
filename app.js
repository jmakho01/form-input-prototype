import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Translate data from database using locTranslator
import { translatingFromDB } from './server/locTranslator.js';

dotenv.config();

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

const app = express();

const PORT = 3099;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const LOCresult = await translatingFromDB("2025-2026");
    res.render('home', { Data: LOCresult });
});

app.post('/update', async (req, res) => {
    try {
        const { type, identifier, updates } = req.body;
        console.log('Update received:', type, identifier, updates);

        if (type === "Division") {
        // Update division info
        const sql = `
            UPDATE divisions
            SET DivisionChair = ?, Dean = ?, LOCRep = ?, PENContact = ?
            WHERE DivisionName = ?;
        `;

        await pool.execute(sql, [
            updates.DivisionChair || null,
            updates.Dean || null,
            updates.LOCRep || null,
            updates.PENContact || null,
            identifier
        ]);

        } else if (type === "Program") {
         // Update program info including payees as JSON
        const sqlProgram = `
            UPDATE programs
            SET HasBeenPaid = ?, ReportSubmitted = ?, Notes = ?, Payees = ?, UnderReview = ?
            WHERE ProgramName = ?;
        `;

        await pool.execute(sqlProgram, [
            updates.HasBeenPaid || null,
            updates.ReportSubmitted || null,
            updates.Notes || null,
            JSON.stringify(updates.Payees || {}),
            updates.UnderReview ?? null,
            identifier
        ]);

        } else {
            return res.json({ success: false, error: "Unknown type" });
        }
        
        const erecord = {
            ct: identifier ?? null,
            ts: new Date(),
            ud: updates ?? null
        };

        await pool.execute(
            "INSERT INTO edits (ct, ts, ud) VALUES (?, ?, ?)", [erecord.ct, erecord.ts, erecord.ud]
        );

        res.json({ success: true });

    } catch (err) {
        console.error('Error updating database:', err);
        res.json({ success: false, error: err.message });
    }
});

app.get('/summary', async(req, res) => {
    //res.render(`summary`, { rows });
    try {
        const [ rows ] = await pool.query('SELECT * FROM divisions INNER JOIN programs ON divisions.DivisionID = programs.DivisionID');
        res.render(`summary`, { rows });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

app.get('/history', async (req, res) => {
    try {
        const [ edits ] = await pool.query('SELECT * FROM edits');

        edits.forEach(edit => {
            edit.formattedTimestamp = new 
		    Date(edit.ts).toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        });

        res.render(`history`, { edits });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading edits: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});