const { Client} = require("pg");
require('dotenv').config();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true})); //aktiverar formulärdata


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
    if(err) {
        console.log("Fel")
    }

    else {
        console.log("Ansluten till databas....")
    }
  });

  //Routing

  app.get("/", async (req, res) => {
    res.render("index");
  });

  app.get("/kurs", async (req, res) => {
    res.render("kurs");
  });

  app.get("/om", async (req, res) => {
    res.render("om");
  });

  app.listen(process.env.DB_PORT, () => {
    console.log("Servern startad på port: " + process.env.DB_PORT)
  });