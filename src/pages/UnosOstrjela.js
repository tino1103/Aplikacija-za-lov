import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DataEntryForm() {
    const [sifraZivotinje, setSifraZivotinje] = useState('');
    const [lokacijaOdstrela, setLokacijaOdstrela] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            sifra_zivotinje: sifraZivotinje,
            lokacija_odstrela: lokacijaOdstrela
        };

        // Retrieve the token from local storage for authorization
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-ostreljene-zivotinje', data, config)
            .then(response => {
                alert('Odstreljena životinja je dodana.');
                navigate("/popis-ostreljenih");
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
    };

    // Styles
    const inputStyle = {
        margin: '10px 0',
        padding: '10px',
        width: '300px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '50px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#f7f7f7' }}>
                <h1>Unos Odstreljene Životinje</h1>
                <div>
                    <label>Šifra životinje:</label>
                    <input
                        type="text"
                        value={sifraZivotinje}
                        onChange={(e) => setSifraZivotinje(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label>Lokacija odstrela:</label>
                    <input
                        type="text"
                        value={lokacijaOdstrela}
                        onChange={(e) => setLokacijaOdstrela(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', color: 'white', backgroundColor: '#007BFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Dodaj Odstrel
                </button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default DataEntryForm;
