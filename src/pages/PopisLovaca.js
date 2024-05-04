import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PopisLovaca() {
    const [lovci, setLovci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-lovaca', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch hunters:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    setLovci(response.data.data);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (brojLovackeIskaznice) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.delete(`http://localhost:3000/obrisi-lovca/${brojLovackeIskaznice}`, config)
            .then(response => {
                if (response.data.error) {
                    console.error('Error deleting hunter:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    setLovci(prevLovci => prevLovci.filter(lovac => lovac.broj_lovacke_iskaznice !== brojLovackeIskaznice));
                    console.log("Deleted successfully");
                }
            })
            .catch(error => {
                console.log("broj:" + brojLovackeIskaznice);
                console.error('Error deleting hunter:', error);
                alert('Error deleting hunter');
            });
    };




    const buttonStyle = {
        padding: '5px 10px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: '#FF6347',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#f7f7f7'
    };

    const thTdStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'left'
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <button onClick={() => navigate('/unos-lovca')} style={{ ...buttonStyle, backgroundColor: '#007BFF' }}>
                Unesi lovca
            </button>
            <div>
                <h1 style={{ color: '#333', textAlign: 'center' }}>Popis Lovaca</h1>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thTdStyle}>Ime</th>
                            <th style={thTdStyle}>Prezime</th>
                            <th style={thTdStyle}>Adresa</th>
                            <th style={thTdStyle}>Datum rođenja</th>
                            <th style={thTdStyle}>Kontakt</th>
                            <th style={thTdStyle}>Korisničko ime</th>
                            <th style={thTdStyle}>Uloga</th>
                            <th style={thTdStyle}>Briši</th> {/* New column for delete button */}
                        </tr>
                    </thead>
                    <tbody>
                        {lovci.map((lovac) => (
                            <tr key={lovac.broj_lovacke_iskaznice}>
                                <td style={thTdStyle}>{lovac.ime}</td>
                                <td style={thTdStyle}>{lovac.prezime}</td>
                                <td style={thTdStyle}>{lovac.adresa}</td>
                                <td style={thTdStyle}>{lovac.datum_rodjenja}</td>
                                <td style={thTdStyle}>{lovac.kontakt}</td>
                                <td style={thTdStyle}>{lovac.korisnicko_ime}</td>
                                <td style={thTdStyle}>{lovac.uloga}</td>
                                <td style={thTdStyle}><button style={buttonStyle} onClick={() => handleDelete(lovac.broj_lovacke_iskaznice)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PopisLovaca;
