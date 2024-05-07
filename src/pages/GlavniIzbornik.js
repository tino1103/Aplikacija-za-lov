import React from 'react';
import { useNavigate } from 'react-router-dom';

function PopisLovaca() {
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
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)', // Two buttons per row
            justifyContent: 'center',
            alignItems: 'center',
            gridGap: '10px', // Spacing between rows and columns
            height: '100vh',
            backgroundColor: '#eee'
        }}>
            <button onClick={() => navigate('/popis-lovaca')} style={buttonStyle}>
                Popis lovaca
            </button>
            <button onClick={() => navigate('/popis-divljaci')} style={buttonStyle}>
                Popis divljači
            </button>
            <button onClick={() => navigate('/popis-bodova')} style={buttonStyle}>
                Popis bodova
            </button>
            <button onClick={() => navigate('/popis-ostrjela')} style={buttonStyle}>
                Popis ostrjela
            </button>
            <button onClick={() => navigate('/popis-prisutnosti')} style={buttonStyle}>
                Popis prisutnosti
            </button>
            <button onClick={() => navigate('/raspored-aktivnosti')} style={buttonStyle}>
                Raspored aktivnosti
            </button>

            <button onClick={() => navigate('/qr')} style={buttonStyle}>
                Qr
            </button>
            <button onClick={() => navigate('/skeniranje-koda')} style={buttonStyle}>
                Skeniranje koda
            </button>
            <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#FF6347' }}>
                Odjava
            </button>
        </div>
    );
}

export default PopisLovaca;
