import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { jwtDecode } from 'jwt-decode';  
import { useNavigate } from 'react-router-dom';

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

    const buttonStyle = {
        padding: '20px 50px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0 10px',
    };

    const labelStyle = {
        fontSize: '18px',
        marginTop: '20px',
    };

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
            <div style={labelStyle}>
                <strong>Broj lovacke iskaznice: </strong>{lovackaIskaznica || 'Nema iskaznice'}
            </div>
            <br></br>
            <QRCode value={lovackaIskaznica || 'No ID'} size={256} />
            <br></br>
            <button onClick={() => navigate('/izbornik-lovac')} style={buttonStyle}>
                Odustani
            </button>
        </div>
    );
}

export default App;
