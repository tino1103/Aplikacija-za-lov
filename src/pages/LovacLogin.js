import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

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
            const response = await axios.post("http://localhost:3000/prijavi-lovac", {
                korisnicko_ime: korisnickoIme,
                lozinka: lozinka,
                recaptcha: captchaValue 
            });

            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem("token", token);
                console.log("Login successful");
                navigate("/izbornik-lovac");
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

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#f7f7f7'
    };

    const inputStyle = {
        margin: '10px 0',
        padding: '10px',
        width: '300px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={{ color: '#333' }}>Prijava lovac</h1>
                <div>
                    <label style={{ margin: '10px 0', fontWeight: 'bold' }}>Korisničko ime:</label>
                    <input
                        type="text"
                        value={korisnickoIme}
                        onChange={(e) => setKorisnickoIme(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={{ margin: '10px 0', fontWeight: 'bold' }}>Lozinka:</label>
                    <input
                        type="password"
                        value={lozinka}
                        onChange={(e) => setLozinka(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <ReCAPTCHA
                    sitekey="6LckwNApAAAAAF08JaAvD8sSdwdkV1LTquS2CtHU" 
                    onChange={onCaptchaChange}
                />
                <button type="submit" style={buttonStyle}>Prijavi</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginForm;