const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("./auth.config.js");
const authJwt = require("./authJwt.js");
const mysql = require("mysql");
app.use(express.json());
var cors = require("cors");
app.use(cors());
var fs = require("fs"); 
const bodyParser = require("body-parser");

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

const bcrypt = require('bcrypt');
const saltRounds = 10; 

app.post("/unos-lovca", authJwt.verifyToken("admin"), function (req, res) {
  const { ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, lozinka, uloga } = req.body;

  bcrypt.hash(lozinka, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ error: true, message: "Problem pri hashiranju lozinke.", detailedError: err.message });
    }

    connection.query(
      "INSERT INTO `Lovac` (`ime`, `prezime`, `adresa`, `datum_rodjenja`, `kontakt`, `korisnicko_ime`, `lozinka`, `uloga`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, hashedPassword, uloga],
      function (error, results, fields) {
        if (error) {
          console.error("Error inserting lovca:", error);
          return res.status(500).send({ error: true, message: "Neuspješno dodavanje lovca.", detailedError: error.sqlMessage });
        }
        res.status(201).send({ error: false, data: results, message: "Lovac je dodan." });
      }
    );
  });
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
    "SELECT * FROM `Lovac` WHERE `korisnicko_ime` = ?",
    [korisnicko_ime],
    function (error, results, fields) {
      if (error) {
        console.error("Error logging in:", error);
        return res.status(500).send({ error: true, message: "Problem prilikom prijave.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        bcrypt.compare(lozinka, results[0].lozinka, function (err, isMatch) {
          if (err) {
            console.error("Error comparing password:", err);
            return res.status(500).send({ error: true, message: "Problem prilikom provjere lozinke.", detailedError: err.message });
          }
          if (isMatch) {
            const token = jwt.sign({ id: results[0].broj_lovacke_iskaznice, uloga: results[0].uloga }, config.secret, { expiresIn: '24h' });
            res.status(200).json({ success: true, message: "Login successful", token: token });
          } else {
            res.status(401).send({ success: false, message: 'Neispravno korisničko ime ili lozinka.' });
          }
        });
      } else {
        res.status(404).send({ success: false, message: 'Korisničko ime ne postoji.' });
      }
    }
  );
});
