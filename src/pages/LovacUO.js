import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';

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
    const [mapInitialized, setMapInitialized] = useState(false);
    const [slika, setSlika] = useState('');
    const videoRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        return stopCamera;
    }, []);

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleCapture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setSlika(imageData);
        stopCamera();
    };

    const handleRetake = () => {
        setSlika('');
        startCamera();
    };

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
            lokacija_odstrijela: `${koordinate.latitude}, ${koordinate.longitude}`,
            slika
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
                stopCamera();
                navigate('/korisnik-popis-ostrjela');
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setMessage(`Error: ${error.message}`);
            });
    };

    const handleCancel = () => {
        stopCamera();
        navigate('/korisnik-popis-ostrjela');
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eee' }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#f7f7f7',
                    maxWidth: '600px',
                    width: '100%',
                    margin: '20px',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    Unos odstrjelene životinje
                </Typography>
                <FormControl fullWidth sx={{ margin: '10px 0' }}>
                    <InputLabel>Vrsta životinje</InputLabel>
                    <Select
                        value={sifraZivotinje}
                        onChange={(e) => setSifraZivotinje(e.target.value)}
                        required
                    >
                        <MenuItem value="">
                            <em>Odaberi vrstu</em>
                        </MenuItem>
                        {animalTypes.map((animal) => (
                            <MenuItem key={animal.sifra_zivotinje} value={animal.sifra_zivotinje}>
                                {animal.vrsta_zivotinje}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ margin: '10px 0', textAlign: 'center' }}>
                    <Typography variant="body1" component="p">
                        Lokacija odstrijela: {koordinate.latitude}, {koordinate.longitude}
                    </Typography>
                </Box>
                <Box sx={{ margin: '10px 0', textAlign: 'center' }}>
                    <Typography variant="body1" component="p" sx={{ fontWeight: 'bold' }}>
                        Dodaj sliku:
                    </Typography>
                    {slika ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <img src={slika} alt="Captured" style={{ width: '300px', height: 'auto', borderRadius: '8px', border: '1px solid #ccc' }} />
                            <Button variant="contained" color="primary" onClick={handleRetake} sx={{ margin: '10px' }}>
                                Ponovno snimi sliku
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <video ref={videoRef} autoPlay style={{ width: '300px', height: '200px', objectFit: 'cover', backgroundColor: 'black', border: '1px solid #ccc', borderRadius: '8px' }}></video>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                                <Button variant="contained" color="primary" onClick={startCamera} sx={{ margin: '5px' }}>
                                    Pokreni kameru
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleCapture} sx={{ margin: '5px' }}>
                                    Usnimi sliku
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
                <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px', width: '100%' }}>
                    Unesi
                </Button>
                <Button type="button" variant="contained" onClick={handleCancel} sx={{ margin: '10px', width: '100%' }}>
                    Odustani
                </Button>
                {message && <Typography color="error" sx={{ margin: '10px' }}>{message}</Typography>}
            </Box>
            {mapInitialized && koordinate && (
                <MapContainer
                    center={[koordinate.latitude, koordinate.longitude]}
                    zoom={15}
                    style={{ width: '100%', height: '400px', marginTop: '20px' }}
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
        </Container>
    );
}

export default DataEntryForm;
