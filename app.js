import express from 'express';

const app = express();

const PORT = 3010;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(`home.ejs`);
});

app.get('/table', (req, res) => {
    res.render(`table.ejs`)
})

const JSONdataTemp = {
    "2025": {
      "year": 2025,
      "read-only": false,
      "tables": {
        "Science": {
          "CSI 240": "Erica Windholm",
          "CSI 276": "John Invidia"
        },
        "Mathematics": {
          "CSI 242": "Chelsea Green",
          "CSI 221": "Mark Junglegoer"
        },
        "Arts and STEM": {
          "CSI 270": "Hiking Mike",
          "CSI 226": "Elise Bossman"
        }
      }
    },
    "2022": {
      "year": 2022,
      "read-only": true,
      "tables": {
        "Science": {
          "CSI 230": "Samuel Johnson",
          "CSI 220": "Irridium Lovely"
        },
        "Mathematics": {
          "MIT 210": "Chelsea Green",
          "MAT 320": "Mark Johnson"
        },
        "Arts and STEM": {
          "ART 250": "Artistic Mike",
          "CHS 226": "Sally Mace"
        }
      }
    }
  };

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});