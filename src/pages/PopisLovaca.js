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

    return [day, month, year.toString().substr(-2)].join('/');
}

function PopisLovaca() {
    const [lovci, setLovci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-lovaca', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch hunters:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedLovci = response.data.data.map(lovac => ({
                        ...lovac,
                        datum_rodjenja: formatDate(lovac.datum_rodjenja)
                    }));
                    setLovci(formattedLovci);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (broj_lovacke_iskaznice) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati lovca?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/lovac-brisi/${broj_lovacke_iskaznice}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting hunter:', response.data.message);
                        alert('Error deleting hunter: ' + response.data.message);
                    } else {
                        setLovci(prevLovci => prevLovci.filter(lovac => lovac.broj_lovacke_iskaznice !== broj_lovacke_iskaznice));
                        console.log("Deleted successfully");
                    }
                })
                .catch(error => {
                    console.error('Error deleting hunter:', error);
                    alert('Error deleting hunter');
                });
        }
    };

    return (
        <Container sx={{ py: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Popis Lovaca
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/unos-lovca')} sx={{ mb: 2 }}>
                    Unesi lovca
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Broj iskaznice</TableCell>
                            <TableCell>Ime</TableCell>
                            <TableCell>Prezime</TableCell>
                            <TableCell>Adresa</TableCell>
                            <TableCell>Datum rođenja</TableCell>
                            <TableCell>Kontakt</TableCell>
                            <TableCell>Korisničko ime</TableCell>
                            <TableCell>Uloga</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lovci.map((lovac) => (
                            <TableRow key={lovac.broj_lovacke_iskaznice}>
                                <TableCell>{lovac.broj_lovacke_iskaznice}</TableCell>
                                <TableCell>{lovac.ime}</TableCell>
                                <TableCell>{lovac.prezime}</TableCell>
                                <TableCell>{lovac.adresa}</TableCell>
                                <TableCell>{lovac.datum_rodjenja}</TableCell>
                                <TableCell>{lovac.kontakt}</TableCell>
                                <TableCell>{lovac.korisnicko_ime}</TableCell>
                                <TableCell>{lovac.uloga}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => navigate('/a-lovac', { state: { lov: lovac } })} sx={{ mr: 1 }}>
                                        Ažuriraj
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(lovac.broj_lovacke_iskaznice)}>
                                        Delete
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

export default PopisLovaca;
