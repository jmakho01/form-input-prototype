import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

export async function translatingFromDB() {

    // Rooted out all null years in sql queries

    // Get divisions
    const [divisions] = await pool.query(`
        SELECT DivisionID, DivisionName, DivisionChair, Dean, LOCRep, PENContact, Year
        FROM divisions
        WHERE Year IS NOT NULL
        ORDER BY Year;
    `);

    // Get years
    const [programs] = await pool.query(`
        SELECT DivisionID, ProgramName, Payees, HasBeenPaid, ReportSubmitted, Notes, UnderReview
        FROM programs;
    `);

    // Build resulting json thingamajig
    const result = {};

    // Every division has details we parse through bit by bit
    for (const d of divisions) {
        const year = d.Year;

        if (!result[year]) {
            result[year] = {};
        }
        // Details from sql turned into the formatted cards
        result[year][d.DivisionName] = {
            DivisionChair: d.DivisionChair,
            Dean: d.Dean,
            LOCRep: d.LOCRep,
            PENContact: d.PENContact,
            Summary: {}
        };

        let array = [];

        for(const p of programs) {
            if(p.DivisionID === d.DivisionID) { 
                array.push(p);
            }
        }

        const divisionPrograms = array;

        for (const p of divisionPrograms) {
            let payeesObj = {};

            try {
                payeesObj =
                    typeof p.Payees === "string" && p.Payees.trim() !== ""
                        ? JSON.parse(p.Payees)
                        : {};
            } catch {
                payeesObj = {};
            }

            result[year][d.DivisionName].Summary[p.ProgramName] = {
                Payees: payeesObj,
                HasBeenPaid: p.HasBeenPaid || "None",
                ReportSubmitted: p.ReportSubmitted || "None",
                Notes: p.Notes || "",
                UnderReview: p.UnderReview === 1
            };
        }
    }

    return result;
}
