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

app.get("/popis-lovaca",authJwt.verifyToken("admin"), function (req, res) {
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



app.put("/azuriraj-lovca/:broj_lovacke_iskaznice",authJwt.verifyToken("admin"), function (req, res) {
  const { broj_lovacke_iskaznice } = req.params;
  const { ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, uloga } = req.body;

  connection.query(
    "UPDATE `Lovac` SET `ime` = ?, `prezime` = ?, `adresa` = ?, `datum_rodjenja` = ?, `kontakt` = ?, `korisnicko_ime` = ?, `uloga` = ? WHERE `broj_lovacke_iskaznice` = ?",
    [ime, prezime, adresa, datum_rodjenja, kontakt, korisnicko_ime, uloga, broj_lovacke_iskaznice],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating lovca:", error);
        return res.status(500).send({ error: true, message: "Neuspješno ažuriranje lovca.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ error: true, message: "Lovac nije pronađen." });
      }
      res.status(200).send({ error: false, data: results, message: "Lovac je ažuriran." });
    }
  );
});




app.delete('/lovac-brisi/:broj_lovacke_iskaznice',authJwt.verifyToken("admin"), (req, res) => {
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

app.post("/unos-aktivnosti", authJwt.verifyToken("admin"), function (req, res) {
  const { naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti } = req.body;

  connection.query(
    "INSERT INTO `Popis_aktivnosti` (`naziv_aktivnosti`, `datum_aktivnosti`, `vrijeme_aktivnosti`, `opis_aktivnosti`) VALUES (?, ?, ?, ?)",
    [naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting activity:", error);
        return res.status(500).send({ error: true, message: "Failed to add activity.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Activity added successfully." });
    }
  );
});



app.get("/popis-aktivnosti",authJwt.verifyToken("admin, korisnik"), function (req, res) {
  connection.query(
    "SELECT `sifra_aktivnosti`, `naziv_aktivnosti`, `datum_aktivnosti`, `vrijeme_aktivnosti`, `opis_aktivnosti` FROM `Popis_aktivnosti`",
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching activities:", error);
        return res.status(500).send({ error: true, message: "Problem retrieving activity data.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "List of activities retrieved successfully." });
    }
  );
});


app.put("/azuriraj-aktivnost/:sifra_aktivnosti", function (req, res) {
  const { sifra_aktivnosti } = req.params;
  const { naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti } = req.body;

  connection.query(
    "UPDATE `Popis_aktivnosti` SET `naziv_aktivnosti` = ?, `datum_aktivnosti` = ?, `vrijeme_aktivnosti` = ?, `opis_aktivnosti` = ? WHERE `sifra_aktivnosti` = ?",
    [naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti, sifra_aktivnosti],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating activity:", error);
        return res.status(500).send({ error: true, message: "Failed to update activity.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ error: true, message: "Activity not found." });
      }
      res.status(200).send({ error: false, data: results, message: "Activity updated successfully." });
    }
  );
});



app.delete('/obrisi-aktivnost/:sifra_aktivnosti',authJwt.verifyToken("admin"), (req, res) => {
  const { sifra_aktivnosti } = req.params;

  connection.query(
    'DELETE FROM `Popis_aktivnosti` WHERE `sifra_aktivnosti` = ?',
    [sifra_aktivnosti],
    (error, results) => {
      if (error) {
        console.error('Error deleting activity:', error);
        return res.status(500).send({ error: true, message: 'Error deleting activity', detailedError: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.send({ error: false, message: 'Activity deleted successfully', affectedRows: results.affectedRows });
      } else {
        res.status(404).send({ error: true, message: 'Activity not found' });
      }
    }
  );
});



//////////////////////////////////////////////////////////////////////////////



app.post("/unos-bodova",authJwt.verifyToken("admin"), function (req, res) {
  const { broj_lovacke_iskaznice, broj_bodova, opis_dodijeljenog_boda } = req.body;

  if (!broj_lovacke_iskaznice) {
    return res.status(400).send({ error: true, message: "Broj lovačke iskaznice je obavezan." });
  }

  connection.query(
    "INSERT INTO `Bodovi` (`broj_lovacke_iskaznice`, `broj_bodova`, `opis_dodijeljenog_boda`) VALUES (?, ?, ?)",
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



app.get("/popis-bodova",authJwt.verifyToken("admin"), function (req, res) {
  connection.query(
    `SELECT b.sifra_dodijeljenog_boda, b.broj_bodova, b.opis_dodijeljenog_boda, l.broj_lovacke_iskaznice, l.ime, l.prezime, l.adresa, l.datum_rodjenja, l.kontakt, l.korisnicko_ime, l.uloga 
        FROM Bodovi b 
        JOIN Lovac l ON b.broj_lovacke_iskaznice = l.broj_lovacke_iskaznice`,
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching bodovi and associated hunter data:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju podataka o bodovima i lovcima.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "Popis bodova i povezani podaci o lovcima dohvaćeni." });
    }
  );
});


app.put("/azuriraj-bodove/:sifra_dodijeljenog_boda",authJwt.verifyToken("admin"), function (req, res) {
  const { sifra_dodijeljenog_boda } = req.params;
  const { broj_bodova, opis_dodijeljenog_boda } = req.body;

  connection.query(
    "UPDATE `Bodovi` SET `broj_bodova` = ?, `opis_dodijeljenog_boda` = ? WHERE `sifra_dodijeljenog_boda` = ?",
    [broj_bodova, opis_dodijeljenog_boda, sifra_dodijeljenog_boda],
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


app.delete("/obrisi-bodove/:sifra_dodijeljenog_boda",authJwt.verifyToken("admin"), function (req, res) {
  const { sifra_dodijeljenog_boda } = req.params;

  connection.query(
    "DELETE FROM`Bodovi` WHERE`Bodovi`.`sifra_dodijeljenog_boda` = ?",
    [sifra_dodijeljenog_boda],
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



app.post("/unos-ostrjelene-zivotinje", authJwt.verifyToken("admin, korisnik"), function (req, res) {
  const { broj_lovacke_iskaznice, sifra_zivotinje, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela, slika } = req.body;

  connection.query(
    "INSERT INTO `Popis_ostrjelene_zivotinje` (`broj_lovacke_iskaznice`, `sifra_zivotinje`, `vrijeme_odstrijela`, `datum_odstrijela`, `lokacija_odstrijela`, `slika`) VALUES (?, ?, ?, ?, ?, ?)",
    [broj_lovacke_iskaznice, sifra_zivotinje, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela, slika],
    function (error, results, fields) {
      if (error) {
        console.error("Error adding culled animal:", error);
        return res.status(500).send({ error: true, message: "Failed to add culled animal.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Culled animal added successfully." });
    }
  );
});



app.get("/vrste-zivotinja",  function (req, res) {
  connection.query(
    "SELECT sifra_zivotinje, vrsta_zivotinje FROM Zivotinja",
    function (error, results) {
      if (error) {
        console.error("Error fetching animal types:", error);
        return res.status(500).send({ error: true, message: "Failed to fetch animal types.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "Animal types fetched successfully." });
    }
  );
});






app.get("/popis-ostreljene-zivotinje", authJwt.verifyToken("admin, korisnik"), function (req, res) {
  const query = `
    SELECT 
      po.sifra_odstrijela,
      l.ime AS ime_lovca, 
      l.prezime AS prezime_lovca, 
      z.vrsta_zivotinje, 
      po.datum_odstrijela, 
      po.vrijeme_odstrijela, 
      po.lokacija_odstrijela, 
      po.slika
    FROM 
      Popis_ostrjelene_zivotinje AS po
    JOIN 
      Lovac AS l ON po.broj_lovacke_iskaznice = l.broj_lovacke_iskaznice
    JOIN 
      Zivotinja AS z ON po.sifra_zivotinje = z.sifra_zivotinje
  `;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error("Error fetching culled animals:", error);
      return res.status(500).send({
        error: true,
        message: "Problem retrieving culled animal data.",
        detailedError: error.sqlMessage
      });
    }

    res.send({
      error: false,
      data: results,
      message: "List of culled animals retrieved successfully."
    });
  });
});



app.put("/azuriraj-ostreljenu-zivotinju/:sifra",authJwt.verifyToken("admin"), function (req, res) {
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


app.delete("/brisi-odstrijel/:sifra_odstrijela",authJwt.verifyToken("admin"), function (req, res) {
  const { sifra_odstrijela } = req.params;

  if (!sifra_odstrijela) {
    return res.status(400).send({
      error: true,
      message: "No culling ID provided."
    });
  }

  const query = `
        DELETE FROM Popis_ostrjelene_zivotinje 
        WHERE sifra_odstrijela = ?
    `;

  connection.query(query, [sifra_odstrijela], function (error, results) {
    if (error) {
      console.error("Error deleting the culled animal:", error);
      return res.status(500).send({
        error: true,
        message: "Failed to delete the culled animal.",
        detailedError: error.sqlMessage
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({
        error: true,
        message: "No culled animal found with the provided ID."
      });
    }

    res.send({
      error: false,
      message: "Culled animal deleted successfully.",
      deletedRows: results.affectedRows
    });
  });
});




//////////////////////////////////////////////////////////////////////////////

app.post("/unos-osobe-u-lov",authJwt.verifyToken("admin"), function (req, res) {
  const { broj_lovacke_iskaznice } = req.body;
  const today = new Date().toISOString().slice(0, 10); 
  connection.query(
    "SELECT sifra_aktivnosti FROM `Popis_aktivnosti` WHERE datum_aktivnosti = ?",
    [today],
    function (err, activityResults) {
      if (err) {
        console.error("Error fetching activity ID:", err);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju šifre aktivnosti.", detailedError: err.message });
      }

      if (activityResults.length === 0) {
        return res.status(404).send({ error: true, message: "Nema definirane aktivnosti za današnji datum." });
      }

      const sifra_aktivnosti = activityResults[0].sifra_aktivnosti;

      connection.query(
        "SELECT SUM(broj_bodova) AS total_points FROM `Bodovi` WHERE broj_lovacke_iskaznice = ?",
        [broj_lovacke_iskaznice],
        function (err, results) {
          if (err) {
            console.error("Error calculating total points:", err);
            return res.status(500).send({ error: true, message: "Problem pri izračunu ukupnih bodova.", detailedError: err.message });
          }

          if (results[0].total_points >= 10) {
            connection.query(
              "INSERT INTO `Popis_osoba_u_lovu` (`broj_lovacke_iskaznice`, `sifra_aktivnosti`) VALUES (?, ?)",
              [broj_lovacke_iskaznice, sifra_aktivnosti],
              function (error, insertResults) {
                if (error) {
                  console.error("Error inserting osoba u lov:", error);
                  return res.status(500).send({ error: true, message: "Neuspješno dodavanje osobe u lov.", detailedError: error.sqlMessage });
                }
                res.status(201).send({ error: false, data: insertResults, message: "Osoba je dodana u lov s aktivnošću." });
              }
            );
          } else {
            res.status(400).send({ error: true, message: "Lovac nema dovoljno bodova (10 ili više)." });
          }
        }
      );
    }
  );
});





app.get("/popis-lovaca-u-lovu",authJwt.verifyToken("admin"), function (req, res) {
  connection.query(
    `SELECT plu.sifra_lova, l.ime, l.prezime, pa.datum_aktivnosti 
     FROM Popis_osoba_u_lovu plu
     JOIN Lovac l ON plu.broj_lovacke_iskaznice = l.broj_lovacke_iskaznice
     JOIN Popis_aktivnosti pa ON plu.sifra_aktivnosti = pa.sifra_aktivnosti`,
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching podaci o lovovima:", error);
        return res.status(500).send({ error: true, message: "Problem pri dohvaćanju podataka o lovovima.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "Popis osoba u lovu dohvaćen s detaljima lovaca i aktivnosti." });
    }
  );
});




app.delete('/popis-brisi/:sifra_lova',authJwt.verifyToken("admin"), (req, res) => {
  const { sifra_lova } = req.params;

  connection.query(
    'DELETE FROM `Popis_osoba_u_lovu` WHERE `Popis_osoba_u_lovu`.`sifra_lova` = ?',
    [sifra_lova],
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



//////////////////////////////////////////////////////////////////////////////

app.post("/unos-zivotinje",authJwt.verifyToken("admin"), function (req, res) {
  const { vrsta_zivotinje, opis_zivotinje } = req.body;

  connection.query(
    "INSERT INTO `Zivotinja` (`vrsta_zivotinje`, `opis_zivotinje`) VALUES (?, ?)",
    [vrsta_zivotinje, opis_zivotinje],
    function (error, results, fields) {
      if (error) {
        console.error("Error adding animal:", error);
        return res.status(500).send({ error: true, message: "Failed to add animal.", detailedError: error.sqlMessage });
      }
      res.status(201).send({ error: false, data: results, message: "Animal added successfully." });
    }
  );
});


app.get("/popis-zivotinja",authJwt.verifyToken("admin"), function (req, res) {
  connection.query(
    "SELECT `sifra_zivotinje`, `vrsta_zivotinje`, `opis_zivotinje` FROM `Zivotinja`",
    function (error, results, fields) {
      if (error) {
        console.error("Error fetching animals:", error);
        return res.status(500).send({ error: true, message: "Problem retrieving animal data.", detailedError: error.sqlMessage });
      }
      res.send({ error: false, data: results, message: "List of animals retrieved successfully." });
    }
  );
});


app.put("/azuriraj-zivotinju/:sifra_zivotinje", function (req, res) {
  const { sifra_zivotinje } = req.params;
  const { vrsta_zivotinje, opis_zivotinje } = req.body;

  connection.query(
    "UPDATE `Zivotinja` SET `vrsta_zivotinje` = ?, `opis_zivotinje` = ? WHERE `sifra_zivotinje` = ?",
    [vrsta_zivotinje, opis_zivotinje, sifra_zivotinje],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating animal:", error);
        return res.status(500).send({ error: true, message: "Failed to update animal.", detailedError: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ error: true, message: "Animal not found." });
      }
      res.status(200).send({ error: false, data: results, message: "Animal updated successfully." });
    }
  );
});


app.delete('/brisi-zivotinju/:sifra_zivotinje',authJwt.verifyToken("admin"), (req, res) => {
  const { sifra_zivotinje } = req.params;

  connection.query(
    'DELETE FROM `Zivotinja` WHERE `sifra_zivotinje` = ?',
    [sifra_zivotinje],
    (error, results) => {
      if (error) {
        console.error('Error deleting the animal:', error);
        return res.status(500).send({ error: true, message: 'Error deleting the animal', detailedError: error.sqlMessage });
      }
      if (results.affectedRows > 0) {
        res.send({ error: false, message: 'Animal deleted successfully', affectedRows: results.affectedRows });
      } else {
        res.status(404).send({ error: true, message: 'Animal not found' });
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

