const express = require("express");
const app = express();
const mysql = require("mysql");
app.use(express.json());
var cors = require("cors");
app.use(cors());
var fs = require("fs"); //require file system object
const bodyParser = require("body-parser");
//probat koristit sequalizer
// Parser za JSON podatke
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "student.veleri.hr",
    user: "vdenona",
    password: "11",
    database: "vdenona",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

app.get("/status", (request, response) => {
    const status = {
        Status: "Running",
    };
    response.send(status);
});

app.post("/unos-lovca", function (req, res) {
  const { ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, lozinka } = req.body;

  connection.query(
    "INSERT INTO `Lovac` (`ime`, `prezime`, `adresa`, `datum_rodjenja`, `kontakt`, `korisnicko_ime`, `lozinka`) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, lozinka],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting lovca:", error);
        // Send back a more detailed error message for debugging
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje lovca.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Lovac je dodan." });
    }
  );
});

app.post("/prijavi", function (req, res) {
  const { korisnicko_ime, lozinka } = req.body;

  connection.query(
    "SELECT * FROM `Lovac` WHERE `korisnicko_ime` = ? AND `lozinka` = ?",
    [korisnicko_ime, lozinka],
    function (error, results, fields) {
      if (error) {
        console.error("Error logging in:", error);
        return res.status(500).send({ error: true, message: "Problem prilikom prijave.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        // If login is successful, indicate where the frontend should redirect the user
        res.status(200).send({
          error: false,
          data: results[0], // Careful with sending sensitive data
          message: "Prijava uspješna.",
          redirect: "/glavni-izbornik"  // Tell the frontend to redirect
        });
      } else {
        res.status(401).send({ error: true, message: "Neispravno korisničko ime ili lozinka." });
      }
    }
  );
});

