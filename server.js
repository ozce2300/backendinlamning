const { Client } = require("pg");
require('dotenv').config();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //aktiverar formulärdata


//Anslut till databas
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
    console.log("Fel")
  }

  else {
    console.log("Ansluten till databas....")
  }
});

//Routing

app.get("/", async (req, res) => {
// Läs ut från databasen efter att app.port är klar
  client.query("SELECT* FROM kurser", (err, result) => {
    if (err) {
      console.log("Fel vid avhämtning")
    }

    else {
      res.render("index", {
        courses: result.rows
      });

    }
  });

});

app.get("/kurs", async (req, res) => {
  res.render("kurs");
});

app.get("/om", async (req, res) => {


  res.render("om");
});

app.post("/", async (req, res) => {

  const coursecode = req.body.coursecode
  const coursename = req.body.coursename
  const syllabus = req.body.syllabus
  const progression = req.body.progression

  //SQL FRÅGA
  const result = await client.query(`
    INSERT INTO kurser(coursecode, coursename, syllabus, progression)VALUES($1, $2, $3, $4)`,
    [coursecode, coursename, syllabus, progression]);

  res.redirect("/kurs");

});

app.listen(process.env.DB_PORT, () => {
  console.log("Servern startad på port: " + process.env.DB_PORT)
});