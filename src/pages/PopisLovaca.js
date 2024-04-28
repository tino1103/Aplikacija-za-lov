import React from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleButton() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/unos-lovca');
    };

    // Styles
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
            <button onClick={handleButtonClick} style={buttonStyle}>
                Unesi lovca
            </button>
        </div>
    );
}

export default SimpleButton;
