import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, Grid, TextField, Typography, MenuItem } from '@mui/material';

function ALovac() {
    const navigate = useNavigate();
    const location = useLocation();
    const [lovac, setLovac] = useState({
        broj_lovacke_iskaznice: '',
        ime: '',
        prezime: '',
        adresa: '',
        datum_rodjenja: '',
        kontakt: '',
        korisnicko_ime: '',
        uloga: ''
    });

    useEffect(() => {
        if (location.state && location.state.lov) {
            setLovac(location.state.lov);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { broj_lovacke_iskaznice, ...updateData } = lovac;

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-lovca/${lovac.broj_lovacke_iskaznice}`, updateData);
            console.log('Update successful:', response.data);
            alert('Lovac je ažuriran.');
            navigate("/popis-lovaca");
        } catch (error) {
            console.error('Error updating lovca:', error);
            alert('Neuspješno ažuriranje lovca.');
        }
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
                    Ažuriraj lovca
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Broj lovačke iskaznice"
                            value={lovac.broj_lovacke_iskaznice}
                            onChange={(e) => setLovac({ ...lovac, broj_lovacke_iskaznice: e.target.value })}
                            fullWidth
                            required
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Ime"
                            value={lovac.ime}
                            onChange={(e) => setLovac({ ...lovac, ime: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Prezime"
                            value={lovac.prezime}
                            onChange={(e) => setLovac({ ...lovac, prezime: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Adresa"
                            value={lovac.adresa}
                            onChange={(e) => setLovac({ ...lovac, adresa: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Datum rođenja"
                            type="date"
                            value={lovac.datum_rodjenja}
                            onChange={(e) => setLovac({ ...lovac, datum_rodjenja: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Kontakt"
                            value={lovac.kontakt}
                            onChange={(e) => setLovac({ ...lovac, kontakt: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Korisničko ime"
                            value={lovac.korisnicko_ime}
                            onChange={(e) => setLovac({ ...lovac, korisnicko_ime: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Uloga"
                            select
                            value={lovac.uloga}
                            onChange={(e) => setLovac({ ...lovac, uloga: e.target.value })}
                            fullWidth
                            required
                        >
                            <MenuItem value="korisnik">Korisnik</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Ažuriraj
                </Button>
                <Button onClick={() => navigate('/popis-lovaca')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
            </Box>
        </Container>
    );
}

export default ALovac;

