import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

function PopisLovaca() {
    const navigate = useNavigate();

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#eee',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Dobrodošli, odaberite opciju
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mt: 4,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{
                        padding: '10px 20px',
                        fontSize: '16px',
                    }}
                >
                    Prijava admin
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/prijava-lovac')}
                    sx={{
                        padding: '10px 20px',
                        fontSize: '16px',
                    }}
                >
                    Prijava lovac
                </Button>
            </Box>
        </Container>
    );
}

export default PopisLovaca;
