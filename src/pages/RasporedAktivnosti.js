import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

function formatDate(dateString) {
    const date = new Date(dateString);
    let day = '' + date.getDate();
    let month = '' + (date.getMonth() + 1);
    let year = date.getFullYear();

    if (day.length < 2)
        day = '0' + day;
    if (month.length < 2)
        month = '0' + month;

    return [day, month, year].join('/');
}

function formatTime(timeString) {
    return timeString.substr(0, 5); 
}

function PopisAktivnosti() {
    const [aktivnosti, setAktivnosti] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-aktivnosti', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch activities:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedAktivnosti = response.data.data.map(aktivnost => ({
                        ...aktivnost,
                        datum_aktivnosti: formatDate(aktivnost.datum_aktivnosti),
                        vrijeme_aktivnosti: formatTime(aktivnost.vrijeme_aktivnosti)
                    }));
                    setAktivnosti(formattedAktivnosti);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_aktivnosti) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati aktivnost?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/obrisi-aktivnost/${sifra_aktivnosti}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting activity:', response.data.message);
                        alert('Error deleting activity: ' + response.data.message);
                    } else {
                        setAktivnosti(prevAktivnosti => prevAktivnosti.filter(aktivnost => aktivnost.sifra_aktivnosti !== sifra_aktivnosti));
                        alert("Aktivnost uspješno izbrisana");
                    }
                })
                .catch(error => {
                    console.error('Error deleting activity:', error);
                    alert('Error deleting activity');
                });
        }
    };

    return (
        <Container sx={{ py: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Popis Aktivnosti
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/unos-rasporeda')}>
                    Unesi aktivnost
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Naziv aktivnosti</TableCell>
                            <TableCell>Datum aktivnosti</TableCell>
                            <TableCell>Vrijeme aktivnosti</TableCell>
                            <TableCell>Opis aktivnosti</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {aktivnosti.map((aktivnost) => (
                            <TableRow key={aktivnost.sifra_aktivnosti}>
                                <TableCell>{aktivnost.naziv_aktivnosti}</TableCell>
                                <TableCell>{aktivnost.datum_aktivnosti}</TableCell>
                                <TableCell>{aktivnost.vrijeme_aktivnosti}</TableCell>
                                <TableCell>{aktivnost.opis_aktivnosti}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => navigate('/a-raspored', { state: { aktiv: aktivnost } })} sx={{ mr: 1 }}>
                                        Ažuriraj
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(aktivnost.sifra_aktivnosti)}>
                                        Obriši
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => navigate('/glavni-izbornik')}>
                    Odustani
                </Button>
            </Box>
        </Container>
    );
}

export default PopisAktivnosti;
