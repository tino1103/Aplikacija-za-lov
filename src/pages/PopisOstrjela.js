import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function DataEntryForm() {
    const [brojLovackeIskaznice, setBrojLovackeIskaznice] = useState('');
    const [animalTypes, setAnimalTypes] = useState([]);
    const [sifraZivotinje, setSifraZivotinje] = useState('');
    const [lokacijaOdstrijela, setLokacijaOdstrijela] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Decode token to get broj_lovacke_iskaznice
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setBrojLovackeIskaznice(decoded.id.toString());
            } catch (error) {
                console.error("Error decoding token:", error);
                setMessage('Error decoding token');
            }
        } else {
            setMessage('No token found');
        }
    }, []);

    // Fetch animal types when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/vrste-zivotinja')
            .then((response) => {
                setAnimalTypes(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching animal types!', error);
                setMessage('Could not load animal types.');
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!brojLovackeIskaznice) {
            setMessage('No hunting license number found.');
            return;
        }

        // Get current date and time
        const now = new Date();
        const datumOdstrijela = now.toISOString().split('T')[0]; // Extracts the YYYY-MM-DD part
        const vrijemeOdstrijela = now.toTimeString().split(' ')[0]; // Extracts the HH:MM:SS part

        const culledAnimalData = {
            broj_lovacke_iskaznice: brojLovackeIskaznice,
            sifra_zivotinje: sifraZivotinje,
            vrijeme_odstrijela: vrijemeOdstrijela,
            datum_odstrijela: datumOdstrijela,
            lokacija_odstrijela: lokacijaOdstrijela
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-ostrjelene-zivotinje', culledAnimalData, config)
            .then((response) => {
                alert('Ostrjelena životinja je dodana.');
                navigate('/popis-ostrjelene-zivotinje');
            })
            .catch((error) => {
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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
                <h1 style={{ color: '#333' }}>Unos ostrjelene životinje</h1>
                <div>
                    <label style={labelStyle}>Vrsta životinje:</label>
                    <select
                        value={sifraZivotinje}
                        onChange={(e) => setSifraZivotinje(e.target.value)}
                        required
                        style={inputStyle}
                    >
                        <option value="">Odaberi vrstu</option>
                        {animalTypes.map((animal) => (
                            <option key={animal.sifra_zivotinje} value={animal.sifra_zivotinje}>{animal.vrsta_zivotinje}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Lokacija odstrijela:</label>
                    <input
                        type="text"
                        value={lokacijaOdstrijela}
                        onChange={(e) => setLokacijaOdstrijela(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br />
                <button onClick={() => navigate('/popis-ostrjelene-zivotinje')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
