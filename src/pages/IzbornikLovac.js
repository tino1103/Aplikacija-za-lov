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

    // Define a function to handle logout
    const handleLogout = () => {
        localStorage.clear();  // Clear all data stored in local storage
        navigate('/pocetna');  // Navigate to login page after clearing local storage
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
            <button onClick={() => navigate('/popis-lovaca')} style={buttonStyle}>
                Popis lovaca
            </button>
            <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#FF6347' }}>
                Odjava
            </button>
        </div>
    );
}

export default PopisLovaca;
