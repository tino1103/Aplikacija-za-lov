import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper
} from '@mui/material';

function formatDate(dateString) {
    const date = new Date(dateString);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

function PopisLovacaULovu() {
    const [lovci, setLovci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-lovaca-u-lovu', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch hunters:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedLovci = response.data.data.map(lovac => ({
                        ...lovac,
                        datum_aktivnosti: formatDate(lovac.datum_aktivnosti)
                    }));
                    setLovci(formattedLovci);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_lova) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati ovu stavku?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/popis-brisi/${sifra_lova}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting entry:', response.data.message);
                        alert('Error deleting entry: ' + response.data.message);
                    } else {
                        setLovci(prevLovci => prevLovci.filter(lovac => lovac.sifra_lova !== sifra_lova));
                        alert("Entry successfully deleted");
                    }
                })
                .catch(error => {
                    console.error('Error deleting entry:', error);
                    alert('Error deleting entry');
                });
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee' }}>
            <Box sx={{ width: '100%', maxWidth: '800px', mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    Popis Lovaca u Lovu
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/unos-prisutnosti')}
                    >
                        Unesi prisutnost
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ime</TableCell>
                                <TableCell>Prezime</TableCell>
                                <TableCell>Datum Aktivnosti</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lovci.map((lovac) => (
                                <TableRow key={lovac.sifra_lova}>
                                    <TableCell>{lovac.ime}</TableCell>
                                    <TableCell>{lovac.prezime}</TableCell>
                                    <TableCell>{lovac.datum_aktivnosti}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(lovac.sifra_lova)}
                                        >
                                            Obriši
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/glavni-izbornik')}
                    >
                        Odustani
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default PopisLovacaULovu;
