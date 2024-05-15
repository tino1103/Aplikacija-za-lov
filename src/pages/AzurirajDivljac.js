import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function AZivotinja() {
    const navigate = useNavigate();
    const location = useLocation();

    const [zivotinja, setZivotinja] = useState({
        sifra_zivotinje: '',
        vrsta_zivotinje: '',
        opis_zivotinje: ''
    });

    useEffect(() => {
        if (location.state && location.state.zivot) {
            setZivotinja(location.state.zivot);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { sifra_zivotinje, ...updateData } = zivotinja;

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-zivotinju/${zivotinja.sifra_zivotinje}`, updateData);
            console.log('Update successful:', response.data);
            alert('Životinja je ažurirana.');
            navigate("/popis-divljaci");
        } catch (error) {
            console.error('Error updating životinja:', error);
            alert('Neuspješno ažuriranje životinje.');
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
                    Ažuriraj životinju
                </Typography>
                {Object.entries(zivotinja).filter(([key]) => key !== 'sifra_zivotinje').map(([key, value]) => (
                    <TextField
                        key={key}
                        label={key.replace(/_/g, ' ')}
                        value={value}
                        onChange={(e) => setZivotinja({ ...zivotinja, [key]: e.target.value })}
                        fullWidth
                        required
                        sx={{ margin: '10px 0' }}
                    />
                ))}
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Ažuriraj
                </Button>
                <Button onClick={() => navigate('/popis-divljaci')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
            </Box>
        </Container>
    );
}

export default AZivotinja;
