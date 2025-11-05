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

const app = express();

const PORT = 3010;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(`home`,  { Data : JSONdataTemp });
});

app.get('/table', (req, res) => {
    res.render(`table`, { JSONdataTemp });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});