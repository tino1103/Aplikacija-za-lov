import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function PopisZivotinja() {
    const [zivotinje, setZivotinje] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-zivotinja', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch animals:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    setZivotinje(response.data.data);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_zivotinje) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati životinju?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/brisi-zivotinju/${sifra_zivotinje}`, config)
.then(response => {
    if (response.data.error) {
        console.error('Error deleting animal:', response.data.message);
        alert('Error deleting animal: ' + response.data.message);
    } else {
        setZivotinje(prevZivotinje => prevZivotinje.filter(zivotinja => zivotinja.sifra_zivotinje !== sifra_zivotinje));
        console.log("Deleted successfully");
    }
})
.catch(error => {
    console.error('Error deleting animal:', error);
    alert('Error deleting animal');
});
}
};

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee', padding: '20px' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Popis Životinja
                </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/unos-divljaci')} sx={{ mb: 2 }}>
                Unesi životinju
            </Button>
            <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto', mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell align="left" sx={{ width: '30%' }}>Vrsta</TableCell>
                        <TableCell align="center" sx={{ width: '40%' }}>Opis</TableCell>
                        <TableCell align="left" sx={{ width: '30%' }}>Akcije</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {zivotinje.map((zivotinja) => (
                            <TableRow key={zivotinja.sifra_zivotinje}>
                                <TableCell align="left" sx={{ width: '30%' }}>{zivotinja.vrsta_zivotinje}</TableCell>
                                <TableCell align="center" sx={{ width: '40%' }}>{zivotinja.opis_zivotinje}</TableCell>
                                <TableCell align="left" sx={{ width: '30%' }}>
                                     <Button variant="contained" color="primary" onClick={() => navigate('/a-divljac', { state: { zivot: zivotinja } })} sx={{ mr: 1 }}>
                                          Ažuriraj
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(zivotinja.sifra_zivotinje)}>
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

export default PopisZivotinja;



