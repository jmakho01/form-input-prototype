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
        "Humanities": {
            "DivisionChair": "Katie Cunnion",
            "Dean": "Jamie Fitzgerald",
            "LOCRep": "Lisa Luengo",
            "PENContact": "Liz Peterson",
            "Summary": { 
                "Communications Studies" : {
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "Notes": "No"
                },
            }
        },
         "Social Science": {
            "DivisionChair": "Mark Thomason",
            "Dean": "Christie Gilliland",
            "LOCRep": "Joy Crawford",
            "PENContact": "Liz Peterson",
            "Summary": { 
                "Anthropology" : {
                    "Payees": {
                        "Madeleine": 500.00,
                        "Joy Crawford": 500.00,
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "Notes": "Yes! Joy and Madeleine (Madeleine gets paid, Joy is a mentor)"
                },
                "History" : {
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "Notes": "No for this round"
                },
                "Political Science" : {
                    "Payees": {
                        "Lindsey": 500.00,
                        "Yoav": 500.00,
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "Submitted 6/15",
                    "Notes": "Yes! Lindsey Smith and Yoav will do a project"
                },
                "Psychology" : {
                    "Payees": {
                        "Joy": 500.00,
                        "Jerry": 500.00,
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "Submitted 6/15",
                    "Notes": "Yes! Joy and Jerry will do a project together"
                },
            }
        },
    },
    "2026-2027": {
        "Science": {
            // Stipend Unit/Academic Program
            "DivisionChair": "David Schienche",
            "Dean": "Christ Elmity",
            "LOCRep": "Monica Lonica",
            "PENContact": "Torrent Stead",
            "Summary": { 
                "Geology" : {
                    "Payees": {
                        "Mars": 333.00,
                        "Fred": 333.00,
                        "Richie": 333.00
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/2/2026",
                    "ReportSubmitted": "5/20/2026",
                    "Notes": "Yes! Mars, Fred, and Richie all work on this together and divide the money three ways."
                },
            }
        },
    }
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