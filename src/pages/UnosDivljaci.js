import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DataEntryForm() {
    const [vrstaZivotinje, setVrstaZivotinje] = useState('');
    const [opisZivotinje, setOpisZivotinje] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const animalData = {
            vrsta_zivotinje: vrstaZivotinje,
            opis_zivotinje: opisZivotinje
        };

        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Set up the configuration for the axios request including the Authorization header
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-zivotinje', animalData, config)
            .then(response => {
                alert('Životinja je dodana.');
                navigate("/popis-divljaci");
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
    };

    // Styles
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

    const labelStyle = {
        margin: '10px 0',
        fontWeight: 'bold'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={{ color: '#333' }}>Unos životinja</h1>
                <div>
                    <label style={labelStyle}>Vrsta životinje:</label>
                    <input
                        type="text"
                        value={vrstaZivotinje}
                        onChange={(e) => setVrstaZivotinje(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Opis životinje:</label>
                    <input
                        type="text"
                        value={opisZivotinje}
                        onChange={(e) => setOpisZivotinje(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br></br>
                <button onClick={() => navigate('/popis-divljaci')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
