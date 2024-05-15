import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function formatDate(dateString) {
    const date = new Date(dateString);
    let day = '' + date.getDate();
    let month = '' + (date.getMonth() + 1);
    let year = date.getFullYear();

    if (day.length < 2)
        day = '0' + day;
    if (month.length < 2)
        month = '0' + month;

    return [day, month, year.toString().substr(-2)].join('/');
}

function PopisBodova() {
    const [bodovi, setBodovi] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-bodova', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch points and associated hunter data:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedBodovi = response.data.data.map(bod => ({
                        ...bod,
                        datum_rodjenja: formatDate(bod.datum_rodjenja)
                    }));
                    setBodovi(formattedBodovi);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_dodijeljenog_boda) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati ovaj bod?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/obrisi-bodove/${sifra_dodijeljenog_boda}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting point:', response.data.message);
                        alert('Error deleting point: ' + response.data.message);
                    } else {
                        setBodovi(prevBodovi => prevBodovi.filter(bod => bod.sifra_dodijeljenog_boda !== sifra_dodijeljenog_boda));
                        console.log("Deleted successfully");
                    }
                })
                .catch(error => {
                    console.error('Error deleting point:', error);
                    alert('Error deleting point');
                });
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee', padding: '20px' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Popis Bodova
                </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/unos-bodova')} sx={{ mb: 2 }}>
                Unesi bod
            </Button>
            <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto', mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Broj bodova</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Ime</TableCell>
                            <TableCell>Prezime</TableCell>
                            <TableCell align="center">Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bodovi.map((bod) => (
                            <TableRow key={bod.sifra_dodijeljenog_boda}>
                                <TableCell>{bod.broj_bodova}</TableCell>
                                <TableCell>{bod.opis_dodijeljenog_boda}</TableCell>
                                <TableCell>{bod.ime}</TableCell>
                                <TableCell>{bod.prezime}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="primary" onClick={() => navigate('/a-bodovi', { state: { bodovi: bod } })} sx={{ mr: 1 }}>
                                        Ažuriraj
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(bod.sifra_dodijeljenog_boda)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" onClick={() => navigate('/glavni-izbornik')}>
                Odustani
            </Button>
        </Container>
    );
}

export default PopisBodova;
