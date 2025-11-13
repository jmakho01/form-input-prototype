import express from 'express';

const JSONdataTemp = {
    //Year
    "2025-2026": {
        //Division
        "Fine Arts": {
            // Stipend Unit/Academic Program
            "DivisionChair": "Paul Metevier",
            "Dean": "Christie Gilliland",
            "LOCRep": "Monica Bowen",
            "PENContact": "Liz Peterson",
            "Summary": { 
                "Music" : {
                    "Payees": {
                        "Sam": 333.00,
                        "Kelly": 333.00,
                        "Ruth": 333.00
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
                    "ReportSubmitted": "5/20/2025",
                    "Notes": "Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways."
                },
            }
        },
        //Division
        "Tomato": {
            // Stipend Unit/Academic Program
            "DivisionChair": "Tomato Metevier",
            "Dean": "Tomato Gilliland",
            "LOCRep": "Tomato Bowen",
            "PENContact": "Tomato Peterson",
            "Summary": { 
                "Tomato" : {
                    "Payees": {
                        "Tomato Sam": 333.00,
                        "Tomato Kelly": 333.00,
                        "Arranged Tomato Ruth": 333.00
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "5/21/2025",
                    "Notes": "Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways."
                },
            }
        },
    },
    // Old table
    // "2022": {
    //   "year": 2022,
    //   "read-only": true,
    //   "tables": {
    //     "Science": {
    //       "CSI 230": "Samuel Johnson",
    //       "CSI 220": "Irridium Lovely"
    //     },
    //     "Mathematics": {
    //       "MIT 210": "Chelsea Green",
    //       "MAT 320": "Mark Johnson"
    //     },
    //     "Arts and STEM": {
    //       "ART 250": "Artistic Mike",
    //       "CHS 226": "Sally Mace"
    //     }
    //   }
    // }
};

//Storing JSON object data into seperate array for summary page
const data = JSONdataTemp["2025-2026"];
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
    res.render(`history`, { rows });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});