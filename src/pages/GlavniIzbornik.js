import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

function GlavniIzbornik() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                backgroundColor: '#eee', // Svijetlo bež
                padding: '20px',
            }}
        >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Glavni Izbornik
                </Typography>
            </Box>
            <Grid
                container
                spacing={2}
                direction={isMobile ? 'column' : 'row'}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/popis-lovaca')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis lovaca
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/popis-divljaci')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis divljači
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/popis-bodova')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis bodova
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/popis-ostrjela')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis ostrjela
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/popis-prisutnosti')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Popis prisutnosti
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/raspored-aktivnosti')}
                        sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Raspored aktivnosti
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/qr')}
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

export default GlavniIzbornik;
