// unos.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

function DataEntryForm() {
    const [brojLovackeIskaznice, setBrojLovackeIskaznice] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [qrScanned, setQrScanned] = useState(false);

    const videoConstraints = {
        facingMode: { exact: "environment" }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!qrScanned) {
                captureAndSubmit();
            }
        }, 1000); 

        return () => clearInterval(interval); 
    }, [qrScanned]);

    const captureAndSubmit = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });
                if (qrCode) {
                    const currentTime = Date.now();
                    const scannedCodes = JSON.parse(localStorage.getItem('scannedCodes')) || {};
                    const lastScanned = scannedCodes[qrCode.data];

                    if (!lastScanned || currentTime - lastScanned > 6000) { 
                        setBrojLovackeIskaznice(qrCode.data);
                        scannedCodes[qrCode.data] = currentTime;
                        localStorage.setItem('scannedCodes', JSON.stringify(scannedCodes));
                        submitForm(qrCode.data);
                    } else {
                        setMessage('');
                    }
                } else {
                    setMessage('Nema QR koda u vidnom polju');
                }
            };
        }
    };

    const submitForm = (brojLovackeIskaznice) => {
        const userData = {
            broj_lovacke_iskaznice: brojLovackeIskaznice
        };

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post('https://c1ea478869cf.ngrok.app/unos-osobe-u-lov', userData, config)
            .then(response => {
                alert('Osoba je dodana u prisutnost.');
                setQrScanned(true); // Prevent further scanning
                navigate("/popis-prisutnosti");
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

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form style={formStyle}>
                <h1 style={{ color: '#333' }}>Unos osobe u lov</h1>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: '100%' }}
                />
                <p>{message}</p>
            </form>
        </div>
    );
}

export default DataEntryForm;
