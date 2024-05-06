import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateHunterForm() {
    const { state } = useLocation();
    const { lovac } = state || {};
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        adresa: '',
        datumRodjenja: '',
        kontakt: '',
        korisnickoIme: '',
        lozinka: '',
        uloga: ''
    });

    useEffect(() => {
        if (lovac) {
            setFormData({
                ime: lovac.ime,
                prezime: lovac.prezime,
                adresa: lovac.adresa,
                datumRodjenja: lovac.datum_rodjenja,
                kontakt: lovac.kontakt,
                korisnickoIme: lovac.korisnicko_ime,
                lozinka: '',  // Password fields typically aren't pre-filled for security reasons
                uloga: lovac.uloga
            });
        }
    }, [lovac]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.put(`http://localhost:3000/update-lovca/${lovac.broj_lovacke_iskaznice}`, formData, config)
            .then(() => {
                alert('Hunter updated successfully');
                navigate('/popis-lovaca');
            })
            .catch(error => {
                console.error('Error updating hunter:', error);
                alert('Failed to update hunter');
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '50px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#f7f7f7' }}>
                <h1>Update Hunter</h1>
                {/* Similar to your existing form inputs, just map through formData for simplicity */}
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" name={key} value={formData[key]} onChange={handleChange} required style={{ margin: '10px', padding: '10px', width: '300px' }} />
                    </div>
                ))}
                <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', color: 'white', backgroundColor: '#007BFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update</button>
            </form>
        </div>
    );
}

export default UpdateHunterForm;
