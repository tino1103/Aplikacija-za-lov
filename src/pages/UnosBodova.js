import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function DataEntryForm() {
    const [brojLovackeIskaznice, setBrojLovackeIskaznice] = useState('');
    const [brojBodova, setBrojBodova] = useState('');
    const [opisDodijeljenogBoda, setOpisDodijeljenogBoda] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const pointsData = {
            broj_lovacke_iskaznice: brojLovackeIskaznice,
            broj_bodova: brojBodova,
            opis_dodijeljenog_boda: opisDodijeljenogBoda
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-bodova', pointsData, config)
            .then(response => {
                alert('Bodovi su dodani.');
                navigate("/popis-bodova"); 
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
                    Unos Bodova
                </Typography>
                <TextField
                    label="Broj lovačke iskaznice"
                    value={brojLovackeIskaznice}
                    onChange={(e) => setBrojLovackeIskaznice(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Broj bodova"
                    type="number"
                    value={brojBodova}
                    onChange={(e) => setBrojBodova(e.target.value)}
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Opis dodijeljenog boda"
                    value={opisDodijeljenogBoda}
                    onChange={(e) => setOpisDodijeljenogBoda(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Unesi
                </Button>
                <Button onClick={() => navigate('/popis-bodova')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px 0' }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default DataEntryForm;
