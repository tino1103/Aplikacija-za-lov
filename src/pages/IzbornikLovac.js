import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

function PopisLovaca() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/pocetna');
    };

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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Popis Lovaca
                </Typography>
            </Box>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/korisnik-popis-ostrjela')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis ostrjela
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/korisnik-raspored-aktivnosti')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Raspored aktivnosti
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/qr-korisnik')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Qr
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Odjava
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default PopisLovaca;
