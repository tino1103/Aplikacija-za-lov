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

app.post("/unos-boravka", function (req, res) {
  const { email, password } = req.body;

  connection.query("INSERT INTO `korisnici` (`email`, `password`) VALUES (?, ?)", [email, password], function (error, results, fields) {
    if (error) {
      console.error("Error inserting boravak:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje boravka." });
    }
    res.status(201).send({ error: false, data: results, message: "Boravak je dodan." });
  });
});