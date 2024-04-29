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


app.post("/unos-aktivnosti", function (req, res) {
  const { sifra_aktivnosti, naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti } = req.body;

  connection.query(
    "INSERT INTO `Popis_aktivnosti` (`sifra_aktivnosti`, `naziv_aktivnosti`, `datum_aktivnosti`, `vrijeme_aktivnosti`, `opis_aktivnosti`) VALUES (?, ?, ?, ?, ?)",
    [sifra_aktivnosti, naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting aktivnost:", error);
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje aktivnosti.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Aktivnost je dodana." });
    }
  );
});


app.post("/unos-bodova", function (req, res) {
  const { broj_lovacke_iskaznice, broj_bodova, opis_dodijeljenog_boda } = req.body;

  connection.query(
    "INSERT INTO `Bodovi_lovca` (`broj_lovacke_iskaznice`, `broj_bodova`, `opis_dodijeljenog_boda`) VALUES (?, ?, ?)",
    [broj_lovacke_iskaznice, broj_bodova, opis_dodijeljenog_boda],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting bodovi:", error);
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje bodova.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Bodovi su dodani." });
    }
  );
});


app.post("/unos-ostreljene-zivotinje", function (req, res) {
  const { sifra_zivotinje, sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela } = req.body;

  connection.query(
    "INSERT INTO `Popis_ostreljene_zivotinje` (`sifra_zivotinje`, `sifra_lova`, `vrijeme_odstrela`, `datum_odstrela`, `lokacija_odstrela`) VALUES (?, ?, ?, ?, ?)",
    [sifra_zivotinje, sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting ostreljena zivotinja:", error);
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje ostreljene životinje.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Ostreljena životinja je dodana." });
    }
  );
});


app.post("/unos-osobe-u-lov", function (req, res) {
  const { sifra_lova, broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda } = req.body;

  connection.query(
    "INSERT INTO `Popis_osoba_u_lovu` (`sifra_lova`, `broj_lovacke_iskaznice`, `sifra_aktivnosti`, `sifra_dodijeljenog_boda`) VALUES (?, ?, ?, ?)",
    [sifra_lova, broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting osoba u lov:", error);
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje osobe u lov.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Osoba u lov je dodana." });
    }
  );
});


app.post("/unos-zivotinje", function (req, res) {
  const { sifra_zivotinje, vrsta_zivotinje, opis_zivotinje } = req.body;

  connection.query(
    "INSERT INTO `Zivotinja` (`sifra_zivotinje`, `vrsta_zivotinje`, `opis_zivotinje`) VALUES (?, ?, ?)",
    [sifra_zivotinje, vrsta_zivotinje, opis_zivotinje],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting zivotinja:", error);
        return res.status(500).send({ error: true, message: "Neuspješno dodavanje životinje.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Životinja je dodana." });
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


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../aukcije-server/auth.config.js");
const authJwt = require("../aukcije-server/authJwt.js");

app.post("/login", function (req, res) {
  const data = req.body;
  const korisnicko_ime = data.korisnicko_ime;
  const lozinka = data.lozinka;

  connection.query("SELECT * FROM korisnik WHERE email_korisnika = ?", [korisnicko_ime], function (err, result) {
    if (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    } else if (result.length > 0) {
      // Compare passwords
      bcrypt.compare(lozinka, result[0].lozinka_korisnika, function (err, bcryptRes) {
        if (bcryptRes) {
          // Generate JWT token
          const token = jwt.sign({ id: result[0].broj_lovacke_iskaznice, email: result[0].korisnicko_ime, uloga: result[0].uloga }, config.secret);
          res.status(200).json({ success: true, message: "Login successful", token: token });
        } else {
          res.status(401).json({ success: false, message: "Invalid email or password " });
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });
});

