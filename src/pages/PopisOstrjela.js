import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function formatDate(dateString) {
    const date = new Date(dateString);
    return [
        ('0' + date.getDate()).slice(-2),
        ('0' + (date.getMonth() + 1)).slice(-2),
        date.getFullYear()
    ].join('/');
}

function PopisOstreljeneDivljaci() {
    const [ostreljeneDivljaci, setOstreljeneDivljaci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-ostreljene-zivotinje', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch culled animals:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedData = response.data.data.map(item => ({
                        ...item,
                        datum_odstrijela: formatDate(item.datum_odstrijela)
                    }));
                    setOstreljeneDivljaci(formattedData);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_odstrijela) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati odstrijeljenu divljač?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/brisi-odstrijel/${sifra_odstrijela}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting culled animal:', response.data.message);
                        alert('Error deleting culled animal: ' + response.data.message);
                    } else {
                        setOstreljeneDivljaci(prevDivljaci => prevDivljaci.filter(divljac => divljac.sifra_odstrijela !== sifra_odstrijela));
                        alert("Odstrijeljena divljač uspješno izbrisana.");
                    }
                })
                .catch(error => {
                    console.error('Error deleting culled animal:', error);
                    alert('Error deleting culled animal');
                });
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee', padding: '20px' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Popis Ostrjeljene Divljaci
                </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/unos-ostrjela')} sx={{ mb: 2 }}>
                Unesi odstrijel
            </Button>
            <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto', mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ime Lovca</TableCell>
                            <TableCell>Prezime Lovca</TableCell>
                            <TableCell>Vrsta Životinje</TableCell>
                            <TableCell>Datum Odstrijela</TableCell>
                            <TableCell>Vrijeme Odstrijela</TableCell>
                            <TableCell>Lokacija Odstrijela</TableCell>
                            <TableCell>Slika</TableCell>
                            <TableCell align="center">Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ostreljeneDivljaci.map((divljac, index) => (
                            <TableRow key={index}>
                                <TableCell>{divljac.ime_lovca}</TableCell>
                                <TableCell>{divljac.prezime_lovca}</TableCell>
                                <TableCell>{divljac.vrsta_zivotinje}</TableCell>
                                <TableCell>{divljac.datum_odstrijela}</TableCell>
                                <TableCell>{divljac.vrijeme_odstrijela}</TableCell>
                                <TableCell>{divljac.lokacija_odstrijela}</TableCell>
                                <TableCell>
                                    {divljac.slika ? (
                                        <img
                                            src={divljac.slika}
                                            alt="Slika odstrjelene divljači"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    ) : (
                                        'Nema slike'
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="error" onClick={() => handleDelete(divljac.sifra_odstrijela)}>
                                        Obriši
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

export default PopisOstreljeneDivljaci;
