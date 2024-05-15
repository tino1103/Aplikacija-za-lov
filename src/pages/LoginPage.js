import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Button, Container, TextField, Typography } from '@mui/material';

function LoginForm() {
    const navigate = useNavigate();
    const [korisnickoIme, setKorisnickoIme] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!captchaValue) {
            setMessage("Please solve the captcha to login");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/prijavi", {
                korisnicko_ime: korisnickoIme,
                lozinka: lozinka,
                recaptcha: captchaValue 
            });

            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem("token", token);
                console.log("Login successful");
                navigate("/glavni-izbornik");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("Internal server error");
        }
    };

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#eee',
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#f7f7f7',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Prijava admin
                </Typography>
                <TextField
                    label="Korisničko ime"
                    variant="outlined"
                    value={korisnickoIme}
                    onChange={(e) => setKorisnickoIme(e.target.value)}
                    required
                    sx={{ margin: '10px 0', width: '300px' }}
                />
                <TextField
                    label="Lozinka"
                    type="password"
                    variant="outlined"
                    value={lozinka}
                    onChange={(e) => setLozinka(e.target.value)}
                    required
                    sx={{ margin: '10px 0', width: '300px' }}
                />
                <ReCAPTCHA
                    sitekey="6LckwNApAAAAAF08JaAvD8sSdwdkV1LTquS2CtHU"
                    onChange={onCaptchaChange}
                    sx={{ margin: '20px 0' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        margin: '10px 0',
                    }}
                >
                    Prijavi
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px 0' }}>{message}</Typography>}
            </Box>
        </Container>
    );
}

export default LoginForm;
