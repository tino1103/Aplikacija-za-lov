import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import {jwtDecode} from 'jwt-decode';  
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

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
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#eee',
                padding: '20px',
            }}
        >
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                <strong>Broj lovačke iskaznice: </strong>{lovackaIskaznica || 'Nema iskaznice'}
            </Typography>
            <QRCode value={lovackaIskaznica || 'No ID'} size={256} />
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/izbornik-lovac')}
                sx={{ mt: 3 }}
            >
                Odustani
            </Button>
        </Container>
    );
}

export default App;
