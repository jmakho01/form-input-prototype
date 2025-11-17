import express from 'express';

const JSONdataTemp = {
    //Year
    "2024-2025": {
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
                    "Payees": {
                        "None": 0
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "None",
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
                    "ReportSubmitted": "None",
                    "Notes": "Yes! Joy and Madeleine (Madeleine gets paid, Joy is a mentor)"
                },
                "History" : {
                    "Payees": {
                        "None": 0
                    },
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
        "English": {
            "DivisionChair": "Ian Sherman",
            "Dean": "Jamie Fitzgerald",
            "LOCRep": "Jake Frye",
            "PENContact": "Liz Peterson",
            "Summary": { 
                "Music" : {
                    "Payees": {
                        "Aley Martin": 175.00,
                        "Claire Salcedo": 175.00,
                        "Ericka Nelson": 175.00,
                        "Jake": 475.00
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/2/2025",
                    "ReportSubmitted": "Report to be completed in year #2",
                    "Notes": "Yes! See notes on adjuncts to pay. Will submit report next year 2025-2026"
                },
            }
        },
        "Science": {
            "DivisionChair": "Katy Shaw and Danny Najera",
            "Dean": "Miebeth Bustillo-Booth",
            "LOCRep": "Nicole Feider",
            "PENContact": "Heather Lambert",
            "Summary": { 
                "Anatomy and Physiology" : {
                    "Payees": {
                        "None": 0
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "None",
                    "Notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21"
                },
                "Biology/Environmental Science" : {
                    "Payees": {
                        "Leo Studach": 334.00,
                        "Stephamie Hoffman": 333.00,
                        "Danny Najera": 333.00
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "Report coming this summer",
                    "Notes": "Yes, they are doing a 2-year project with majors level Bio classes"
                },
                "Geology/Oceanography" : {
                    "Payees": {
                        "None": 0
                    },
                    "HasBeenPaid": "Emails sent to Building Admins on 5/3/2025",
                    "ReportSubmitted": "None",
                    "Notes": "Initial Invite Sent from Julie 9/26/24. Follow up on 10/21 and 11/20"
                },
            }
        },
    },
    "2025-2026": {
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
    res.render(`history`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});