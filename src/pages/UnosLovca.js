import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DataEntryForm() {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [adresa, setAdresa] = useState('');
    const [datum_rodjenja, setDatumRodjenja] = useState('');
    const [kontakt, setKontakt] = useState('');
    const [korisnickoIme, setKorisnickoIme] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [message, setMessage] = useState('');
    const [uloga, setUloga] = useState('korisnik'); // Default role
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            ime,
            prezime,
            adresa,
            datum_rodjenja,
            kontakt,
            korisnicko_ime: korisnickoIme,
            lozinka,
            uloga
        };

        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Set up the configuration for the axios request including the Authorization header
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        console.log(token);

        axios.post('http://localhost:3000/unos-lovca', userData, config)
            .then(response => {
                alert('Lovac je dodan.');
                navigate("/popis-lovaca");
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
                <h1 style={{ color: '#333' }}>Unos lovaca</h1>
                <div>
                    <label style={labelStyle}>Ime:</label>
                    <input
                        type="text"
                        value={ime}
                        onChange={(e) => setIme(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Prezime:</label>
                    <input
                        type="text"
                        value={prezime}
                        onChange={(e) => setPrezime(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Adresa:</label>
                    <input
                        type="text"
                        value={adresa}
                        onChange={(e) => setAdresa(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Datum rođenja:</label>
                    <input
                        type="date"
                        value={datum_rodjenja}
                        onChange={(e) => setDatumRodjenja(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Kontakt:</label>
                    <input
                        type="text"
                        value={kontakt}
                        onChange={(e) => setKontakt(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Korisničko ime:</label>
                    <input
                        type="text"
                        value={korisnickoIme}
                        onChange={(e) => setKorisnickoIme(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Lozinka:</label>
                    <input
                        type="text"  // Changed to password type for security
                        value={lozinka}
                        onChange={(e) => setLozinka(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Uloga:</label>
                    <select
                        value={uloga}
                        onChange={(e) => setUloga(e.target.value)}
                        required
                        style={inputStyle}
                    >
                        <option value="korisnik">Korisnik</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br></br>
                <button onClick={() => navigate('/popis-lovaca')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
