import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PopisLovaca() {
    const [lovci, setLovci] = useState([]);
    const navigate = useNavigate();

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
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'row', // Changed from 'column' to 'row'
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#eee'
        }}>
            <button onClick={() => navigate('/login')} style={buttonStyle}>
                Prijava admin
            </button>
            <button onClick={() => navigate('/prijava-lovac')} style={buttonStyle}>
                Prijava lovac
            </button>
            
        </div>
    );
}

export default PopisLovaca;
