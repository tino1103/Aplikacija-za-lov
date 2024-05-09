import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DataEntryForm() {
    const [nazivAktivnosti, setNazivAktivnosti] = useState('');
    const [datumAktivnosti, setDatumAktivnosti] = useState('');
    const [vrijemeAktivnosti, setVrijemeAktivnosti] = useState('');
    const [opisAktivnosti, setOpisAktivnosti] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const activityData = {
            naziv_aktivnosti: nazivAktivnosti,
            datum_aktivnosti: datumAktivnosti,
            vrijeme_aktivnosti: vrijemeAktivnosti,
            opis_aktivnosti: opisAktivnosti
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-aktivnosti', activityData, config)
            .then(response => {
                alert('Aktivnost je dodana.');
                navigate("/raspored-aktivnosti");
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

    const labelStyle = {
        margin: '10px 0',
        fontWeight: 'bold'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={{ color: '#333' }}>Unos Aktivnosti</h1>
                <div>
                    <label style={labelStyle}>Naziv aktivnosti:</label>
                    <input
                        type="text"
                        value={nazivAktivnosti}
                        onChange={(e) => setNazivAktivnosti(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Datum aktivnosti:</label>
                    <input
                        type="date"
                        value={datumAktivnosti}
                        onChange={(e) => setDatumAktivnosti(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Vrijeme aktivnosti:</label>
                    <input
                        type="time"
                        value={vrijemeAktivnosti}
                        onChange={(e) => setVrijemeAktivnosti(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Opis aktivnosti:</label>
                    <textarea
                        value={opisAktivnosti}
                        onChange={(e) => setOpisAktivnosti(e.target.value)}
                        required
                        style={{ ...inputStyle, height: '100px' }}  
                    />
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br></br>
                <button onClick={() => navigate('/raspored-aktivnosti')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
