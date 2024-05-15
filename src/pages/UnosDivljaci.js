import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function DataEntryForm() {
    const [vrstaZivotinje, setVrstaZivotinje] = useState('');
    const [opisZivotinje, setOpisZivotinje] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const animalData = {
            vrsta_zivotinje: vrstaZivotinje,
            opis_zivotinje: opisZivotinje
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-zivotinje', animalData, config)
            .then(response => {
                alert('Životinja je dodana.');
                navigate("/popis-divljaci");
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
                    Unos životinja
                </Typography>
                <TextField
                    label="Vrsta životinje"
                    value={vrstaZivotinje}
                    onChange={(e) => setVrstaZivotinje(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Opis životinje"
                    value={opisZivotinje}
                    onChange={(e) => setOpisZivotinje(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0', width: '100%' }}>
                    Unesi
                </Button>
                <Button onClick={() => navigate('/popis-divljaci')} variant="contained" sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px 0' }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default DataEntryForm;
