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

app.get("/popis-lovaca", function (req, res) {
  connection.query(
    "SELECT `broj_lovacke_iskaznice`, `ime`, `prezime`, `adresa`, `datum_rodjenja`, `kontakt`, `korisnicko_ime`, `uloga` FROM `Lovac`",
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching lovci:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju podataka o lovcima.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "Popis lovaca dohvaćen." });
    }
  );
});


app.put("/azuriraj-lovca/:id", authJwt.verifyToken("admin"), function (req, res) {
  const { id } = req.params;
  const { ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, uloga } = req.body;

  connection.query(
    "UPDATE `Lovac` SET `ime` = ?, `prezime` = ?, `adresa` = ?, `datum_rodjenja` = ?, `kontakt` = ?, `korisnicko_ime` = ?, `uloga` = ? WHERE `id` = ?",
    [ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, uloga, id],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating lovca:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju lovca.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Lovac nije pronađen." });
      } else {
        res.send({ error: false, data: results, message: "Podaci o lovcu ažurirani." });
      }
    }
  );
});



app.delete('/lovac-brisi/:broj_lovacke_iskaznice', (req, res) => {
  const { broj_lovacke_iskaznice } = req.params;

  connection.query(
    'DELETE FROM `Lovac` WHERE `Lovac`.`broj_lovacke_iskaznice` = ?',
    [broj_lovacke_iskaznice],
    (error, results) => {
      if (error) {
        console.error('Error deleting the hunter:', error);
        return res.status(500).send({ error: true, message: 'Error deleting the hunter', detailedError: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.send({ error: false, message: 'Hunter deleted successfully', affectedRows: results.affectedRows });
      } else {
        res.status(404).send({ error: true, message: 'Hunter not found' });
      }
    }
  );
});



//////////////////////////////////////////////////////////////////////////////////

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


app.get("/aktivnost/:sifra", function (req, res) {
  const { sifra } = req.params;
  connection.query(
    "SELECT `naziv_aktivnosti`, `datum_aktivnosti`, `vrijeme_aktivnosti`, `opis_aktivnosti` FROM `Popis_aktivnosti` WHERE `sifra_aktivnosti` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching aktivnost:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju aktivnosti.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        res.send({ error: false, data: results[0], message: "Podaci o aktivnosti dohvaćeni." });
      } else {
        res.status(404).send({ error: true, message: "Aktivnost nije pronađena." });
      }
    }
  );
});

app.put("/azuriraj-aktivnost/:sifra", function (req, res) {
  const { sifra } = req.params;
  const { naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti } = req.body;

  connection.query(
    "UPDATE `Popis_aktivnosti` SET `naziv_aktivnosti` = ?, `datum_aktivnosti` = ?, `vrijeme_aktivnosti` = ?, `opis_aktivnosti` = ? WHERE `sifra_aktivnosti` = ?",
    [naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti, sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating aktivnost:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju aktivnosti.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Aktivnost nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Podaci o aktivnosti ažurirani." });
      }
    }
  );
});


app.delete("/obrisi-aktivnost/:sifra", function (req, res) {
  const { sifra } = req.params;

  connection.query(
    "DELETE FROM `Popis_aktivnosti` WHERE `sifra_aktivnosti` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting aktivnost:", error);
        return res.status(500).send({ error: true, message: "Problem pri brisanju aktivnosti.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Aktivnost nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Aktivnost je obrisana." });
      }
    }
  );
});


//////////////////////////////////////////////////////////////////////////////



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


app.get("/bodovi-lovca/:broj_iskaznice", function (req, res) {
  const { broj_iskaznice } = req.params;
  connection.query(
    "SELECT `broj_bodova`, `opis_dodijeljenog_boda` FROM `Bodovi_lovca` WHERE `broj_lovacke_iskaznice` = ?",
    [broj_iskaznice],
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching bodovi:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju bodova.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        res.send({ error: false, data: results, message: "Podaci o bodovima dohvaćeni." });
      } else {
        res.status(404).send({ error: true, message: "Bodovi za navedenu lovačku iskaznicu nisu pronađeni." });
      }
    }
  );
});


app.put("/azuriraj-bodove/:id", function (req, res) {
  const { id } = req.params;
  const { broj_bodova, opis_dodijeljenog_boda } = req.body;

  connection.query(
    "UPDATE `Bodovi_lovca` SET `broj_bodova` = ?, `opis_dodijeljenog_boda` = ? WHERE `id` = ?",
    [broj_bodova, opis_dodijeljenog_boda, id],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating bodovi:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju bodova.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Bodovi nisu pronađeni." });
      } else {
        res.send({ error: false, data: results, message: "Bodovi su ažurirani." });
      }
    }
  );
});


app.delete("/obrisi-bodove/:id", function (req, res) {
  const { id } = req.params;

  connection.query(
    "DELETE FROM `Bodovi_lovca` WHERE `id` = ?",
    [id],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting bodovi:", error);
        return res.status(500).send({ error: true, message: "Problem pri brisanju bodova.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Bodovi nisu pronađeni." });
      } else {
        res.send({ error: false, data: results, message: "Bodovi su obrisani." });
      }
    }
  );
});



//////////////////////////////////////////////////////////////////////////////


app.post("/unos-ostreljene-zivotinje", function (req, res) {
  const { sifra_zivotinje, sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela } = req.body;

  // Provjera da li je osoba prisutna u lovu na današnji dan
  const checkPresenceSql = `
    SELECT * FROM Popis_osoba_u_lovu
    WHERE sifra_lova = ? AND datum_aktivnosti = CURDATE()
  `;

  connection.query(checkPresenceSql, [sifra_lova], function (error, results, fields) {
    if (error) {
      console.error("Error checking presence in hunt:", error);
      return res.status(500).send({ error: true, message: "Problem pri provjeri prisutnosti u lovu.", detailedError: error.sqlMessage });
    }

    // Ako je osoba prisutna, izvrši unos ostreljene životinje
    if (results.length > 0) {
      const insertAnimalSql = `
        INSERT INTO Popis_ostreljene_zivotinje
        (sifra_zivotinje, sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela) 
        VALUES (?, ?, ?, ?, ?)
      `;
      connection.query(insertAnimalSql, [sifra_zivotinje, sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela], function (insertError, insertResults) {
        if (insertError) {
          console.error("Error inserting ostreljena zivotinja:", insertError);
          return res.status(500).send({ error: true, message: "Neuspješno dodavanje ostreljene životinje.", detailedError: insertError.sqlMessage });
        }
        res.status(201).send({ error: false, data: insertResults, message: "Ostreljena životinja je dodana." });
      });
    } else {
      res.status(403).send({ error: true, message: "Osoba nije prisutna u lovu na današnji dan." });
    }
  });
});


app.get("/ostreljena-zivotinja/:sifra", function (req, res) {
  const { sifra } = req.params;
  connection.query(
    "SELECT `sifra_lova`, `vrijeme_odstrela`, `datum_odstrela`, `lokacija_odstrela` FROM `Popis_ostreljene_zivotinje` WHERE `sifra_zivotinje` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching ostreljena zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju podataka o ostreljenoj životinji.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        res.send({ error: false, data: results[0], message: "Podaci o ostreljenoj životinji dohvaćeni." });
      } else {
        res.status(404).send({ error: true, message: "Ostreljena životinja nije pronađena." });
      }
    }
  );
});

app.put("/azuriraj-ostreljenu-zivotinju/:sifra", function (req, res) {
  const { sifra } = req.params;
  const { sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela } = req.body;

  connection.query(
    "UPDATE `Popis_ostreljene_zivotinje` SET `sifra_lova` = ?, `vrijeme_odstrela` = ?, `datum_odstrela` = ?, `lokacija_odstrela` = ? WHERE `sifra_zivotinje` = ?",
    [sifra_lova, vrijeme_odstrela, datum_odstrela, lokacija_odstrela, sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating ostreljena zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju podataka o ostreljenoj životinji.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Ostreljena životinja nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Podaci o ostreljenoj životinji ažurirani." });
      }
    }
  );
});


app.delete("/obrisi-ostreljenu-zivotinju/:sifra", function (req, res) {
  const { sifra } = req.params;

  connection.query(
    "DELETE FROM `Popis_ostreljene_zivotinje` WHERE `sifra_zivotinje` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting ostreljena zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri brisanju ostreljene životinje.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Ostreljena životinja nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Ostreljena životinja je obrisana." });
      }
    }
  );
});



//////////////////////////////////////////////////////////////////////////////

app.post("/unos-osobe-u-lov", function (req, res) {
  const { sifra_lova, broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda } = req.body;

  const checkPointsSql = `
    SELECT SUM(broj_bodova) AS totalPoints 
    FROM Bodovi_lovca 
    WHERE broj_lovacke_iskaznice = ?
  `;

  connection.query(checkPointsSql, [broj_lovacke_iskaznice], function (err, results) {
    if (err) {
      console.error("Error checking points:", err);
      return res.status(500).send({ error: true, message: "Problem pri provjeri bodova.", detailedError: err.sqlMessage });
    }

    if (results[0].totalPoints >= 10) {
      const insertSql = `
        INSERT INTO Popis_osoba_u_lovu 
        (sifra_lova, broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda) 
        VALUES (?, ?, ?, ?)
      `;
      connection.query(insertSql, [sifra_lova, broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda], function (insertError, insertResults) {
        if (insertError) {
          console.error("Error inserting osoba u lov:", insertError);
          return res.status(500).send({ error: true, message: "Neuspješno dodavanje osobe u lov.", detailedError: insertError.sqlMessage });
        }
        res.status(201).send({ error: false, data: insertResults, message: "Osoba u lov je dodana." });
      });
    } else {
      res.status(403).send({ error: true, message: "Lovac nema dovoljno bodova (potrebno najmanje 10)." });
    }
  });
});



app.get("/osoba-u-lovu/:sifra_lova", function (req, res) {
  const { sifra_lova } = req.params;
  connection.query(
    "SELECT `broj_lovacke_iskaznice`, `sifra_aktivnosti`, `sifra_dodijeljenog_boda` FROM `Popis_osoba_u_lovu` WHERE `sifra_lova` = ?",
    [sifra_lova],
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching osoba u lov:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju osobe u lovu.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        res.send({ error: false, data: results, message: "Podaci o osobama u lovu dohvaćeni." });
      } else {
        res.status(404).send({ error: true, message: "Osoba u lovu nije pronađena." });
      }
    }
  );
});


app.put("/azuriraj-osobu-u-lovu/:sifra_lova", function (req, res) {
  const { sifra_lova } = req.params;
  const { broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda } = req.body;

  connection.query(
    "UPDATE `Popis_osoba_u_lovu` SET `broj_lovacke_iskaznice` = ?, `sifra_aktivnosti` = ?, `sifra_dodijeljenog_boda` = ? WHERE `sifra_lova` = ?",
    [broj_lovacke_iskaznice, sifra_aktivnosti, sifra_dodijeljenog_boda, sifra_lova],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating osoba u lov:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju osobe u lovu.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Osoba u lovu nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Podaci o osobi u lovu ažurirani." });
      }
    }
  );
});


app.delete("/obrisi-osobu-u-lovu/:sifra_lova", function (req, res) {
  const { sifra_lova } = req.params;

  connection.query(
    "DELETE FROM `Popis_osoba_u_lovu` WHERE `sifra_lova` = ?",
    [sifra_lova],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting osoba u lov:", error);
        return res.status(500).send({ error: true, message: "Problem pri brisanju osobe u lovu.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Osoba u lovu nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Osoba u lovu je obrisana." });
      }
    }
  );
});



//////////////////////////////////////////////////////////////////////////////

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

app.get("/zivotinja/:sifra", function (req, res) {
  const { sifra } = req.params;
  connection.query(
    "SELECT `vrsta_zivotinje`, `opis_zivotinje` FROM `Zivotinja` WHERE `sifra_zivotinje` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju životinje.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        res.send({ error: false, data: results[0], message: "Podaci o životinji dohvaćeni." });
      } else {
        res.status(404).send({ error: true, message: "Životinja nije pronađena." });
      }
    }
  );
});

app.put("/azuriraj-zivotinju/:sifra", function (req, res) {
  const { sifra } = req.params;
  const { vrsta_zivotinje, opis_zivotinje } = req.body;

  connection.query(
    "UPDATE `Zivotinja` SET `vrsta_zivotinje` = ?, `opis_zivotinje` = ? WHERE `sifra_zivotinje` = ?",
    [vrsta_zivotinje, opis_zivotinje, sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri ažuriranju životinje.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Životinja nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Podaci o životinji ažurirani." });
      }
    }
  );
});

app.delete("/obrisi-zivotinju/:sifra", function (req, res) {
  const { sifra } = req.params;

  connection.query(
    "DELETE FROM `Zivotinja` WHERE `sifra_zivotinje` = ?",
    [sifra],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting zivotinja:", error);
        return res.status(500).send({ error: true, message: "Problem pri brisanju životinje.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        res.status(404).send({ error: true, message: "Životinja nije pronađena." });
      } else {
        res.send({ error: false, data: results, message: "Životinja je obrisana." });
      }
    }
  );
});




//////////////////////////////////////////////////////////////////////////////

app.post("/prijavi", function (req, res) {
  const { korisnicko_ime, lozinka } = req.body;

  connection.query(
    "SELECT * FROM `Lovac` WHERE `korisnicko_ime` = ? AND `uloga` = 'admin'",
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
        res.send({ status: 'failure', message: 'Neispravni poaci za prijavu' });
      }
    }
  );
});

app.post("/prijavi-lovac", function (req, res) {
  const { korisnicko_ime, lozinka } = req.body;

  connection.query(
    "SELECT * FROM `Lovac` WHERE `korisnicko_ime` = ? AND `uloga` = 'korisnik'",
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
        res.send({ status: 'failure', message: 'Neispravni poaci za prijavu' });
      }
    }
  );
});










const QRCode = require("qrcode");

app.use(express.json());

app.post("/generate-qr", (req, res) => {
  const { brojLovackeIskaznice, korisnickoIme } = req.body;


  const qrContent = `Broj iskaznice: ${brojLovackeIskaznice}, Korisničko ime: ${korisnickoIme}`;

  QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'H' }, (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return res.status(500).send({ error: true, message: "Problem pri generiranju QR koda.", detailedError: err.message });
    }
    res.status(200).send({ success: true, qrCodeUrl: url, message: "QR kod je uspješno generiran." });
  });
});

