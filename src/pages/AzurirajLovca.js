import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ALovac() {
    const navigate = useNavigate();

    const location = useLocation();
    const [lovac, setLovac] = useState({
        broj_lovacke_iskaznice: '',
        ime: '',
        prezime: '',
        adresa: '',
        datum_rodjenja: '',
        kontakt: '',
        korisnicko_ime: '',
        uloga: ''
    });

    useEffect(() => {
        if (location.state && location.state.lov) {
            setLovac(location.state.lov);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const { broj_lovacke_iskaznice, ...updateData } = lovac; 

        try {
            const response = await axios.put(`http://localhost:3000/azuriraj-lovca/${lovac.broj_lovacke_iskaznice}`, updateData);
            console.log('Update successful:', response.data);
            alert('Lovac je ažuriran.');
            navigate("/popis-lovaca");
        } catch (error) {
            console.error('Error updating lovca:', error);
            alert('Neuspješno ažuriranje lovca.');
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
                <h1 style={{ color: '#333' }}>Edit Hunter</h1>
                {Object.entries(lovac).map(([key, value]) => (
                    <div key={key}>
                        <label style={labelStyle}>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setLovac({ ...lovac, [key]: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                ))}
                <button type="submit" style={buttonStyle}>Ažuriraj</button>
                <br></br>

                <button onClick={() => navigate('/popis-lovaca')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
        </div>
    );
}

export default ALovac;
