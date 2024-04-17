import { createPool } from 'mysql';

// Konfiguracija za povezivanje s MySQL bazom
const pool = createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Tino1103+-',
    database: 'LovackiDnevnik'
});

// CREATE operacija: Dodaj novu životinju
function createZivotinja(vrsta, opis) {
    pool.query(
        'INSERT INTO Zivotinja (vrsta_zivotinje, opis_zivotinje) VALUES (?, ?)',
        [vrsta, opis],
        (error, results) => {
            if (error) throw error;
            console.log('Dodana životinja s ID:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve životinje
function getAllZivotinje() {
    pool.query('SELECT * FROM Zivotinja', (error, results) => {
        if (error) throw error;
        console.log('Podaci o životinjama:', results);
    });
}

// UPDATE operacija: Ažuriraj životinju
function updateZivotinja(id, vrsta, opis) {
    pool.query(
        'UPDATE Zivotinja SET vrsta_zivotinje = ?, opis_zivotinje = ? WHERE sifra_zivotinje = ?',
        [vrsta, opis, id],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran broj zapisa:', results.affectedRows);
        }
    );
}

// DELETE operacija: Obriši životinju
function deleteZivotinja(id) {
    pool.query(
        'DELETE FROM Zivotinja WHERE sifra_zivotinje = ?',
        [id],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisani broj zapisa:', results.affectedRows);
        }
    );
}


//////////////////////////////////////////////////////////////////

// CREATE operacija: Dodaj novog lovca
function createLovac(ime, prezime, adresa, datum_rodenja, kontakt, korisnicko_ime, lozinka) {
    pool.query(
        'INSERT INTO Lovac (ime, prezime, adresa, datum_rodenja, kontakt, korisnicko_ime, lozinka) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [ime, prezime, adresa, datum_rodenja, kontakt, korisnicko_ime, lozinka],
        (error, results) => {
            if (error) throw error;
            console.log('Dodan lovac s brojem iskaznice:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve lovce
function getAllLovci() {
    pool.query('SELECT * FROM Lovac', (error, results) => {
        if (error) throw error;
        console.log('Podaci o lovcima:', results);
    });
}

// READ operacija: Dohvati lovca po broju iskaznice
function getLovacByBrojIskaznice(brojIskaznice) {
    pool.query(
        'SELECT * FROM Lovac WHERE broj_lovacke_iskaznice = ?',
        [brojIskaznice],
        (error, results) => {
            if (error) throw error;
            console.log('Podaci o lovcu:', results);
        }
    );
}

// UPDATE operacija: Ažuriraj lovca
function updateLovac(brojIskaznice, ime, prezime, adresa, datum_rodenja, kontakt, korisnicko_ime, lozinka) {
    pool.query(
        'UPDATE Lovac SET ime = ?, prezime = ?, adresa = ?, datum_rodenja = ?, kontakt = ?, korisnicko_ime = ?, lozinka = ? WHERE broj_lovacke_iskaznice = ?',
        [ime, prezime, adresa, datum_rodenja, kontakt, korisnicko_ime, lozinka, brojIskaznice],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran lovac s brojem iskaznice:', brojIskaznice);
        }
    );
}

// DELETE operacija: Obriši lovca
function deleteLovac(brojIskaznice) {
    pool.query(
        'DELETE FROM Lovac WHERE broj_lovacke_iskaznice = ?',
        [brojIskaznice],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisan lovac s brojem iskaznice:', brojIskaznice);
        }
    );
}

//////////////////////////////////////////////////////////////////


// CREATE operacija: Dodaj novu aktivnost
function createAktivnost(naziv, datum, vrijeme, opis) {
    pool.query(
        'INSERT INTO Popis_aktivnosti (naziv_aktivnosti, datum_aktivnosti, vrijeme_aktivnosti, opis_aktivnosti) VALUES (?, ?, ?, ?)',
        [naziv, datum, vrijeme, opis],
        (error, results) => {
            if (error) throw error;
            console.log('Dodana aktivnost s ID:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve aktivnosti
function getAllAktivnosti() {
    pool.query('SELECT * FROM Popis_aktivnosti', (error, results) => {
        if (error) throw error;
        console.log('Podaci o aktivnostima:', results);
    });
}

// UPDATE operacija: Ažuriraj aktivnost
function updateAktivnost(id, naziv, datum, vrijeme, opis) {
    pool.query(
        'UPDATE Popis_aktivnosti SET naziv_aktivnosti = ?, datum_aktivnosti = ?, vrijeme_aktivnosti = ?, opis_aktivnosti = ? WHERE sifra_aktivnosti = ?',
        [naziv, datum, vrijeme, opis, id],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran broj zapisa:', results.affectedRows);
        }
    );
}

// DELETE operacija: Obriši aktivnost
function deleteAktivnost(id) {
    pool.query(
        'DELETE FROM Popis_aktivnosti WHERE sifra_aktivnosti = ?',
        [id],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisani broj zapisa:', results.affectedRows);
        }
    );
}

//////////////////////////////////////////////////////////////////


// CREATE operacija: Dodaj osobu u lov
function createOsobaULovu(brojLovackeIskaznice, sifraAktivnosti) {
    pool.query(
        'INSERT INTO Popis_osoba_u_lovu (broj_lovacke_iskaznice, sifra_aktivnosti) VALUES (?, ?)',
        [brojLovackeIskaznice, sifraAktivnosti],
        (error, results) => {
            if (error) throw error;
            console.log('Dodana osoba u lov s ID:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve osobe u lovu
function getAllOsobeULovu() {
    pool.query('SELECT * FROM Popis_osoba_u_lovu', (error, results) => {
        if (error) throw error;
        console.log('Podaci o osobama u lovu:', results);
    });
}

// UPDATE operacija: Ažuriraj osobu u lovu
function updateOsobaULovu(sifraLova, brojLovackeIskaznice, sifraAktivnosti) {
    pool.query(
        'UPDATE Popis_osoba_u_lovu SET broj_lovacke_iskaznice = ?, sifra_aktivnosti = ? WHERE sifra_lova = ?',
        [brojLovackeIskaznice, sifraAktivnosti, sifraLova],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran broj zapisa:', results.affectedRows);
        }
    );
}

// DELETE operacija: Obriši osobu iz lova
function deleteOsobaULovu(sifraLova) {
    pool.query(
        'DELETE FROM Popis_osoba_u_lovu WHERE sifra_lova = ?',
        [sifraLova],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisani broj zapisa:', results.affectedRows);
        }
    );
}


//////////////////////////////////////////////////////////////////


// CREATE operacija: Dodaj nove bodove lovcu
function createBodoviLovca(iskaznica, bodovi, opis) {
    pool.query(
        'INSERT INTO Bodovi_lovca (broj_lovacke_iskaznice, broj_bodova, opis_dodijeljenog_boda) VALUES (?, ?, ?)',
        [iskaznica, bodovi, opis],
        (error, results) => {
            if (error) throw error;
            console.log('Dodani bodovi lovcu s ID:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve bodove lovaca
function getAllBodoviLovca() {
    pool.query('SELECT * FROM Bodovi_lovca', (error, results) => {
        if (error) throw error;
        console.log('Podaci o bodovima lovaca:', results);
    });
}

// UPDATE operacija: Ažuriraj bodove lovca
function updateBodoviLovca(sifra, iskaznica, bodovi, opis) {
    pool.query(
        'UPDATE Bodovi_lovca SET broj_lovacke_iskaznice = ?, broj_bodova = ?, opis_dodijeljenog_boda = ? WHERE sifra_dodijeljenog_boda = ?',
        [iskaznica, bodovi, opis, sifra],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran broj zapisa:', results.affectedRows);
        }
    );
}

// DELETE operacija: Obriši bodove lovca
function deleteBodoviLovca(sifra) {
    pool.query(
        'DELETE FROM Bodovi_lovca WHERE sifra_dodijeljenog_boda = ?',
        [sifra],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisani broj zapisa:', results.affectedRows);
        }
    );
}


//////////////////////////////////////////////////////////////////


// CREATE operacija: Dodaj odstrijeljenu životinju
function createOdstrijel(sifra_zivotinje, sifra_lova, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela) {
    pool.query(
        'INSERT INTO Popis_odstrijeljene_zivotinje (sifra_zivotinje, sifra_lova, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela) VALUES (?, ?, ?, ?, ?)',
        [sifra_zivotinje, sifra_lova, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela],
        (error, results) => {
            if (error) throw error;
            console.log('Dodan odstrijel s ID:', results.insertId);
        }
    );
}

// READ operacija: Dohvati sve odstrijeljene životinje
function getAllOdstrijeli() {
    pool.query('SELECT * FROM Popis_odstrijeljene_zivotinje', (error, results) => {
        if (error) throw error;
        console.log('Podaci o odstrijelu:', results);
    });
}

// UPDATE operacija: Ažuriraj odstrijeljenu životinju
function updateOdstrijel(id, sifra_zivotinje, sifra_lova, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela) {
    pool.query(
        'UPDATE Popis_odstrijeljene_zivotinje SET sifra_zivotinje = ?, sifra_lova = ?, vrijeme_odstrijela = ?, datum_odstrijela = ?, lokacija_odstrijela = ? WHERE sifra_odstrijela = ?',
        [sifra_zivotinje, sifra_lova, vrijeme_odstrijela, datum_odstrijela, lokacija_odstrijela, id],
        (error, results) => {
            if (error) throw error;
            console.log('Ažuriran odstrijel s ID:', id, '- Broj ažuriranih zapisa:', results.affectedRows);
        }
    );
}

// DELETE operacija: Obriši odstrijeljenu životinju
function deleteOdstrijel(id) {
    pool.query(
        'DELETE FROM Popis_odstrijeljene_zivotinje WHERE sifra_odstrijela = ?',
        [id],
        (error, results) => {
            if (error) throw error;
            console.log('Obrisan odstrijel s ID:', id, '- Broj obrisanih zapisa:', results.affectedRows);
        }
    );
}



pool.end();
