import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Button, TextField, Typography } from '@mui/material';

function AAktivnost() {
    const navigate = useNavigate();
    const location = useLocation();
    const [aktivnost, setAktivnost] = useState({
        sifra_aktivnosti: '',
        naziv_aktivnosti: '',
        datum_aktivnosti: '',
        vrijeme_aktivnosti: '',
        opis_aktivnosti: ''
    });

    useEffect(() => {
        if (location.state && location.state.aktiv) {
            setAktivnost(location.state.aktiv);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { sifra_aktivnosti, ...updateData } = aktivnost;

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-aktivnost/${aktivnost.sifra_aktivnosti}`, updateData);
            console.log('Update successful:', response.data);
            alert('Aktivnost je ažurirana.');
            navigate("/raspored-aktivnosti");
        } catch (error) {
            console.error('Error updating activity:', error);
            alert('Neuspješno ažuriranje aktivnosti.');
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee' }}>
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
                    maxWidth: '600px',
                    width: '100%',
                    margin: '20px',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    Ažuriraj aktivnost
                </Typography>
                {Object.entries(aktivnost).filter(([key]) => key !== 'sifra_aktivnosti').map(([key, value]) => (
                    <TextField
                        key={key}
                        label={key.replace(/_/g, ' ')}
                        type={key.includes('datum') ? "date" : key.includes('vrijeme') ? "time" : "text"}
                        value={value}
                        onChange={(e) => setAktivnost({ ...aktivnost, [key]: e.target.value })}
                        required={key !== 'opis_aktivnosti'}
                        fullWidth
                        sx={{ margin: '10px 0' }}
                        InputLabelProps={key.includes('datum') || key.includes('vrijeme') ? { shrink: true } : {}}
                    />
                ))}
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '20px 0', width: '100%' }}>
                    Ažuriraj
                </Button>
                <Button type="button" variant="contained" onClick={() => navigate('/raspored-aktivnosti')} sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
            </Box>
        </Container>
    );
}

export default AAktivnost;
