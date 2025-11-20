import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

//Pulling data from seperate js file to not bloat app.js
import { JSONdataTemp } from './public/scripts/locdata.js';

//Storing JSON object data into seperate array for summary page
const data = JSONdataTemp["2024-2025"];
const rows = [];
/*
for (const [divisionName, division] of Object.entries(data)) {
  for (const [programName, summary] of Object.entries(division.Summary)) {
    rows.push({
      division: divisionName,
      program: programName,
      chair: division.DivisionChair,
      dean: division.Dean,
      locRep: division.LOCRep,
      penContact: division.PENContact,
      payees: Object.entries(summary.Payees)
        .map(([n, v]) => `${n}: $${v}`)
        .join(", "),
      paid: summary.HasBeenPaid,
      report: summary.ReportSubmitted,
      notes: summary.Notes,
    });
  }
}
*/
dotenv.config();

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();


// app.post('/submit-form', async(req, res) => {
//   try {
//       const edits = req.body;
//       console.log('New order submitted:', order);
//       order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";
//       const sql =
//           `INSERT INTO divisions(divisionID, divisionName, dean, locRep, penContact, academicProgram, payees, hasBeenPaid, reportSubmitted, notes)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
//       const params = [
//           edits.divisionID,
//           edits.,
//           edits.flavor,
//           edits.cone,
//           edits.toppings,
//       ];
//       const [result] = await pool.execute(sql, params);
//       console.log('Order saved with ID:', result.insertId);
//       res.render('confirmation', {order});
//   } catch (err) {
//       console.error("Error saving order:", err);
//       res.status(500).send("Sorry, there was an error processing your order. Please try again.");
//   }
// });

const app = express();

const PORT = 3099;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(`home`,  { Data : JSONdataTemp });
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

app.get('/history', (req, res) => {
    res.render(`history`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});