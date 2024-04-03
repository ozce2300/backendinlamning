const { Client } = require("pg");
require('dotenv').config();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Anslut till databas
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) {
    console.log("Fel vid anslutning till databasen:", err);
  } else {
    console.log("Ansluten till databas....");
  }
});

// Routing
app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM kurser");
    res.render("index", {
      courses: result.rows,
    });
  } catch (error) {
    console.error("Fel vid hämtning av kurser:", error);
    res.status(500).send("Ett fel uppstod vid hämtning av kurser.");
  }
});

app.get("/kurs", async (req, res) => {
  res.render("kurs", {
    errors: [],
  });
});

app.get("/om", async (req, res) => {
  res.render("om");
});

app.post("/", async (req, res) => {
  const { coursecode, coursename, syllabus, progression } = req.body;

  let errors = [];

  if (coursecode === "") {
    errors.push("Skriv in kurskod");
  }

  if (coursename === "") {
    errors.push("Skriv in kursnamn");
  }

  if (syllabus === "") {
    errors.push("Skriv in länk");
  }

  if (coursecode.length < 5) {
    errors.push("Kurskoden måste vara minst 5 tecken lång");
  }

  if (errors.length > 0) {
    res.render("kurs", {
      errors: errors,
    });
  } else {
    try {
      const result = await client.query(`
        INSERT INTO kurser(coursecode, coursename, syllabus, progression)
        VALUES($1, $2, $3, $4)`,
        [coursecode, coursename, syllabus, progression]);

      res.redirect("/kurs");
    } catch (error) {
      console.error("Fel vid insättning av kurs:", error);
      res.status(500).send("Ett fel uppstod vid insättning av kurs.");
    }
  }
});

app.listen(process.env.DB_PORT, () => {
  console.log("Servern startad på port: " + process.env.DB_PORT);
});
