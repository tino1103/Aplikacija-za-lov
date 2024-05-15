import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function ABodovi() {
    const navigate = useNavigate();
    const location = useLocation();
    const [bod, setBod] = useState({
        sifra_dodijeljenog_boda: '',
        broj_bodova: '',
        opis_dodijeljenog_boda: ''
    });

    useEffect(() => {
        if (location.state && location.state.bodovi) {
            setBod({
                sifra_dodijeljenog_boda: location.state.bodovi.sifra_dodijeljenog_boda,
                broj_bodova: location.state.bodovi.broj_bodova,
                opis_dodijeljenog_boda: location.state.bodovi.opis_dodijeljenog_boda
            });
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-bodove/${bod.sifra_dodijeljenog_boda}`, {
                broj_bodova: bod.broj_bodova,
                opis_dodijeljenog_boda: bod.opis_dodijeljenog_boda
            }, { headers });

            console.log('Update successful:', response.data);
            alert('Bod je ažuriran.');
            navigate("/popis-bodova");
        } catch (error) {
            console.error('Error updating bod:', error);
            alert('Neuspješno ažuriranje boda.');
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
                    maxWidth: '500px', 
                    width: '100%', 
                    margin: '20px' 
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    Ažuriraj bodove
                </Typography>
                {Object.entries(bod).filter(([key]) => key !== 'sifra_dodijeljenog_boda').map(([key, value]) => (
                    <TextField
                        key={key}
                        label={key.replace(/_/g, ' ')}
                        value={value}
                        onChange={(e) => setBod({ ...bod, [key]: e.target.value })}
                        fullWidth
                        required
                        sx={{ margin: '10px 0' }}
                    />
                ))}
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Ažuriraj
                </Button>
                <Button onClick={() => navigate('/popis-bodova')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
            </Box>
        </Container>
    );
}

export default ABodovi;
