import express from 'express';

const JSONdataTemp = {
    //Year
    "2025-2026": {
        //Division
        "Fine Arts": {
            // Stipend Unit/Academic Program
            "Contact: Divison Chair": "Paul Metevier",
            "Contact: Dean": "Christie Gilliland",
            "Contact: LOC rep": "Monica Bowen",
            "PEN Contact": "Liz Peterson",
            "Music" : {
                "Payee(s)": {
                    "Sam": 333.00,
                    "Kelly": 333.00,
                    "Ruth": 333.00
                },
                "Has been paid (PEN form initiated)": "Emails sent to Building Admins on 5/2/2025",
                "Report Submitted": "5/20/2025",
                "Notes": "Yes! Sam, Kelly, and Ruth all work on this together and divide the money three ways."
            },
        },
        "Humanities": {
            // Stipend Unit/Academic Program
            "Communication Studies" : {
                "Contact: Divison Chair": "Katie Cunnion",
                "Contact: Dean": "Jamie Fitzgerald",
                "Contact: LOC rep": "Lisa Luengo",
                "PEN Contact": "Liz Peterson",
                "Payee(s)": {
                },
                "Has been paid (PEN form initiated)": "Emails sent to Building Admins on 5/2/2025",
                "Report Submitted": "",
                "Notes": "No"
            },
        },
        "Social Science": {
            // Stipend Unit/Academic Program
            "Anthropology" : {
                "Contact: Divison Chair": "Mark Thomason",
                "Contact: Dean": "Jamie Fitzgerald",
                "Contact: LOC rep": "Lisa Luengo",
                "PEN Contact": "Liz Peterson",
                "Payee(s)": {
                },
                "Has been paid (PEN form initiated)": "Emails sent to Building Admins on 5/2/2025",
                "Report Submitted": "",
                "Notes": "No"
            },
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
    res.render(`table.ejs`)
})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});