import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DataEntryForm() {
    const [brojLovackeIskaznice, setBrojLovackeIskaznice] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            broj_lovacke_iskaznice: brojLovackeIskaznice
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-osobe-u-lov', userData, config)
            .then(response => {
                alert('Osoba je dodana u prisutnost.');
                navigate("/popis-prisutnosti");  
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
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
                <h1 style={{ color: '#333' }}>Unos osobe u lov</h1>
                <div>
                    <label style={{ margin: '10px 0', fontWeight: 'bold' }}>Broj lovačke iskaznice:</label>
                    <input
                        type="text"
                        value={brojLovackeIskaznice}
                        onChange={(e) => setBrojLovackeIskaznice(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br></br>
                <button onClick={() => navigate('/popis-prisutnosti')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
