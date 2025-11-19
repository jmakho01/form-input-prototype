import express from 'express';

//Pulling data from seperate js file to not bloat app.js
import { JSONdataTemp } from './public/scripts/locdata.js';

//Storing JSON object data into seperate array for summary page
const data = JSONdataTemp["2024-2025"];
const rows = [];

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

const app = express();

const PORT = 3099;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(`home`,  { Data : JSONdataTemp });
});

app.get('/summary', (req, res) => {
    res.render(`summary`, { rows });
});

app.get('/history', (req, res) => {
    res.render(`history`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});