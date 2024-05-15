import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import {jwtDecode} from 'jwt-decode';  // Changed from import { jwtDecode } to import jwtDecode
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography } from '@mui/material';

function App() {
    const navigate = useNavigate();
    const [lovackaIskaznica, setLovackaIskaznica] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');  
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                const idAsString = String(decoded.id);  
                setLovackaIskaznica(idAsString);  
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', backgroundColor: '#eee' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    <strong>Broj lovacke iskaznice: </strong>{lovackaIskaznica || 'Nema iskaznice'}
                </Typography>
                <QRCode value={lovackaIskaznica || 'No ID'} size={256} />
            </Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/glavni-izbornik')} sx={{ mt: 3 }}>
                Odustani
            </Button>
        </Container>
    );
}

export default App;
