import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, MenuItem } from '@mui/material';

function DataEntryForm() {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [adresa, setAdresa] = useState('');
    const [datum_rodjenja, setDatumRodjenja] = useState('');
    const [kontakt, setKontakt] = useState('');
    const [korisnickoIme, setKorisnickoIme] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [message, setMessage] = useState('');
    const [uloga, setUloga] = useState('korisnik'); 
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            ime,
            prezime,
            adresa,
            datum_rodjenja,
            kontakt,
            korisnicko_ime: korisnickoIme,
            lozinka,
            uloga
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        console.log(token);

        axios.post('http://localhost:3000/unos-lovca', userData, config)
            .then(response => {
                alert('Lovac je dodan.');
                navigate("/popis-lovaca");
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee' }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#f7f7f7',
                    maxWidth: '500px', // Postavljanje maksimalne širine
                    width: '100%', // Postavljanje širine na 100% unutar maksimalne širine
                    margin: '20px' // Dodavanje margine za razmak od rubova
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    Unos lovaca
                </Typography>
                <TextField
                    label="Ime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Prezime"
                    value={prezime}
                    onChange={(e) => setPrezime(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Adresa"
                    value={adresa}
                    onChange={(e) => setAdresa(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Datum rođenja"
                    type="date"
                    value={datum_rodjenja}
                    onChange={(e) => setDatumRodjenja(e.target.value)}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Kontakt"
                    value={kontakt}
                    onChange={(e) => setKontakt(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Korisničko ime"
                    value={korisnickoIme}
                    onChange={(e) => setKorisnickoIme(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Lozinka"
                    type="password"
                    value={lozinka}
                    onChange={(e) => setLozinka(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Uloga"
                    select
                    value={uloga}
                    onChange={(e) => setUloga(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                >
                    <MenuItem value="korisnik">Korisnik</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Unesi
                </Button>
                <Button onClick={() => navigate('/popis-lovaca')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px 0' }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default DataEntryForm;
