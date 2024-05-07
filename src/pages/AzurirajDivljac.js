import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function AZivotinja() {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize state with the structure for an animal
    const [zivotinja, setZivotinja] = useState({
        sifra_zivotinje: '',
        vrsta_zivotinje: '',
        opis_zivotinje: ''
    });

    useEffect(() => {
        // Check if location state exists and has animal data
        if (location.state && location.state.zivot) {
            setZivotinja(location.state.zivot);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from submitting the default way
        const { sifra_zivotinje, ...updateData } = zivotinja; // Destructure to separate the ID from other data

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-zivotinju/${zivotinja.sifra_zivotinje}`, updateData);
            console.log('Update successful:', response.data);
            alert('Životinja je ažurirana.');
            navigate("/popis-divljaci");
        } catch (error) {
            console.error('Error updating životinja:', error);
            alert('Neuspješno ažuriranje životinje.');
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
                <h1 style={{ color: '#333' }}>Edit Animal</h1>
                {Object.entries(zivotinja).filter(([key]) => key !== 'sifra_zivotinje').map(([key, value]) => (
                    <div key={key}>
                        <label style={labelStyle}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setZivotinja({ ...zivotinja, [key]: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                ))}
                <button type="submit" style={buttonStyle}>Ažuriraj</button>
                <br></br>
                <button onClick={() => navigate('/popis-divljaci')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
        </div>
    );
}

export default AZivotinja;
