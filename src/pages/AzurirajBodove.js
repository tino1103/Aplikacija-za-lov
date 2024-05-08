import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ABodovi() {
    const navigate = useNavigate();
    const location = useLocation();
    const [bod, setBod] = useState({
        sifra_dodijeljenog_boda: '',
        broj_bodova: '',
        opis_dodijeljenog_boda: ''
    });

    useEffect(() => {
        // Check if location state exists and has bod data
        if (location.state && location.state.bodovi) {
            setBod({
                sifra_dodijeljenog_boda: location.state.bodovi.sifra_dodijeljenog_boda,
                broj_bodova: location.state.bodovi.broj_bodova,
                opis_dodijeljenog_boda: location.state.bodovi.opis_dodijeljenog_boda
            });
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-bodove/${bod.sifra_dodijeljenog_boda}`, {
                broj_bodova: bod.broj_bodova,
                opis_dodijeljenog_boda: bod.opis_dodijeljenog_boda
            }, { headers });

            console.log('Update successful:', response.data);
            alert('Bod je ažuriran.');
            navigate("/popis-bodova");
        } catch (error) {
            console.error('Error updating bod:', error);
            alert('Neuspješno ažuriranje boda.');
        }
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
                <h1 style={{ color: '#333' }}>Update Points</h1>
                {Object.entries(bod).map(([key, value]) => (
                    <div key={key}>
                        <label style={labelStyle}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setBod({ ...bod, [key]: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                ))}
                <button type="submit" style={buttonStyle}>Update</button>
                <br />

                <button onClick={() => navigate('/popis-bodova')} style={buttonStyle}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default ABodovi;
