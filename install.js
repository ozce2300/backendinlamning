const { Client} = require("pg");
require('dotenv').config();


//Anslut till databas med kod hämtad från .env
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

  //Skapa tabell

  client.query(`
  DROP TABLE IF EXISTS kurser;
  CREATE TABLE kurser (
    id SERIAL PRIMARY KEY NOT NULL,
    coursecode VARCHAR(40),
    coursename VARCHAR(50),
    syllabus VARCHAR(100),
    progression VARCHAR(1)
  )
  `)