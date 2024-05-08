import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Override the default Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function DataEntryForm() {
    const [brojLovackeIskaznice, setBrojLovackeIskaznice] = useState('');
    const [animalTypes, setAnimalTypes] = useState([]);
    const [sifraZivotinje, setSifraZivotinje] = useState('');
    const [koordinate, setKoordinate] = useState({ latitude: 0, longitude: 0 });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [mapInitialized, setMapInitialized] = useState(false);

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

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setKoordinate({ latitude, longitude });
                setMapInitialized(true);
            }, (error) => {
                console.error('Geolocation error:', error);
            }, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            });
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!brojLovackeIskaznice) {
            setMessage('No hunting license number found.');
            return;
        }

        const now = new Date();
        const datumOdstrijela = now.toISOString().split('T')[0];
        const vrijemeOdstrijela = now.toTimeString().split(' ')[0];

        const culledAnimalData = {
            broj_lovacke_iskaznice: brojLovackeIskaznice,
            sifra_zivotinje: sifraZivotinje,
            vrijeme_odstrijela: vrijemeOdstrijela,
            datum_odstrijela: datumOdstrijela,
            lokacija_odstrijela: `${koordinate.latitude}, ${koordinate.longitude}`
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('http://localhost:3000/unos-ostrjelene-zivotinje', culledAnimalData, config)
            .then(() => {
                alert('Ostrjelena životinja je dodana.');
                navigate('/popis-ostrjelene-zivotinje');
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#eee'
    };

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

    const mapStyle = {
        width: '650px',
        height: '650px',
        margin: '50px'
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={{ color: '#333' }}>Unos odstrjelene životinje</h1>
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
                    <p>{koordinate.latitude}, {koordinate.longitude}</p>
                </div>
                <button type="submit" style={buttonStyle}>Unesi</button>
                <br />
                <button onClick={() => navigate('/popis-ostrjelene-zivotinje')} style={buttonStyle}>
                    Odustani
                </button>
            </form>
            {mapInitialized && koordinate && (
                <MapContainer
                    center={[koordinate.latitude, koordinate.longitude]}
                    zoom={15}
                    style={mapStyle}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[koordinate.latitude, koordinate.longitude]}>
                        <Popup>Vaša trenutna lokacija</Popup>
                    </Marker>
                </MapContainer>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataEntryForm;
