import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, TextField, Typography, TextareaAutosize } from '@mui/material';

function DataEntryForm() {
    const [nazivAktivnosti, setNazivAktivnosti] = useState('');
    const [datumAktivnosti, setDatumAktivnosti] = useState('');
    const [vrijemeAktivnosti, setVrijemeAktivnosti] = useState('');
    const [opisAktivnosti, setOpisAktivnosti] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const activityData = {
            naziv_aktivnosti: nazivAktivnosti,
            datum_aktivnosti: datumAktivnosti,
            vrijeme_aktivnosti: vrijemeAktivnosti,
            opis_aktivnosti: opisAktivnosti
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-aktivnosti', activityData, config)
            .then(response => {
                alert('Aktivnost je dodana.');
                navigate("/raspored-aktivnosti");
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
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
                    Unos Aktivnosti
                </Typography>
                <TextField
                    label="Naziv aktivnosti"
                    value={nazivAktivnosti}
                    onChange={(e) => setNazivAktivnosti(e.target.value)}
                    required
                    fullWidth
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Datum aktivnosti"
                    type="date"
                    value={datumAktivnosti}
                    onChange={(e) => setDatumAktivnosti(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ margin: '10px 0' }}
                />
                <TextField
                    label="Vrijeme aktivnosti"
                    type="time"
                    value={vrijemeAktivnosti}
                    onChange={(e) => setVrijemeAktivnosti(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ margin: '10px 0' }}
                />
                <TextareaAutosize
                    minRows={4}
                    placeholder="Opis aktivnosti"
                    value={opisAktivnosti}
                    onChange={(e) => setOpisAktivnosti(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', borderColor: '#ccc' }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '20px 0', width: '100%' }}>
                    Unesi
                </Button>
                <Button type="button" variant="contained" onClick={() => navigate('/raspored-aktivnosti')} sx={{ margin: '10px 0', width: '100%' }}>
                    Odustani
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px' }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default DataEntryForm;
