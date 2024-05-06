import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { jwtDecode } from 'jwt-decode';  // Ispravan named import
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    const [lovackaIskaznica, setLovackaIskaznica] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');  // Dohvatite token iz localStorage
        if (token) {
            try {
                const decoded = jwtDecode(token);  // Dekodirajte token
                const idAsString = String(decoded.id);  // Pretvorite ID u string
                setLovackaIskaznica(idAsString);  // Podesite broj lovačke iskaznice kao string
            } catch (error) {
                console.error("Error decoding token:", error);
            }

            
        }
    }, []);

const buttonStyle = {
        padding: '20px 50px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: '#007BFF', // Standardize background color
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0 10px', // Add margin to create space between buttons
    };

    return (
        <div className="App">
            <h1>Moj QR kod sa brojem iskaznice</h1>
            <QRCode value={lovackaIskaznica || 'No ID'} size={256} />

            <button onClick={() => navigate('/glavni-izbornik')} style={buttonStyle}>
                Odustani
            </button>
        </div>

    );
}

export default App;
