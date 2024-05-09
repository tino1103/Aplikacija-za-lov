import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function AAktivnost() {
    const navigate = useNavigate();
    const location = useLocation();
    const [aktivnost, setAktivnost] = useState({
        sifra_aktivnosti: '',
        naziv_aktivnosti: '',
        datum_aktivnosti: '',
        vrijeme_aktivnosti: '',
        opis_aktivnosti: ''
    });

    useEffect(() => {
        if (location.state && location.state.aktiv) {
            setAktivnost(location.state.aktiv);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const { sifra_aktivnosti, ...updateData } = aktivnost; 

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-aktivnost/${aktivnost.sifra_aktivnosti}`, updateData);
            console.log('Update successful:', response.data);
            alert('Aktivnost je ažurirana.');
            navigate("/raspored-aktivnosti");
        } catch (error) {
            console.error('Error updating activity:', error);
            alert('Neuspješno ažuriranje aktivnosti.');
        }
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
                <h1 style={{ color: '#333' }}>Edit Activity</h1>
                {Object.entries(aktivnost).filter(([key]) => key !== 'sifra_aktivnosti').map(([key, value]) => (
                    <div key={key}>
                        <label style={labelStyle}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type={key.includes('datum') ? "date" : key.includes('vrijeme') ? "time" : "text"}
                            value={value}
                            onChange={(e) => setAktivnost({ ...aktivnost, [key]: e.target.value })}
                            style={inputStyle}
                            required={key !== 'opis_aktivnosti'}
                        />
                    </div>
                ))}
                <button type="submit" style={buttonStyle}>Ažuriraj</button>
                <br></br>
                <button onClick={() => navigate('/raspored-aktivnosti')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
        </div>
    );
}

export default AAktivnost;
