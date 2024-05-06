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

    const handleDelete = (broj_lovacke_iskaznice) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.delete(`http://localhost:3000/lovac-brisi/${broj_lovacke_iskaznice}`, config)
            .then(response => {
                if (response.data.error) {
                    console.error('Error deleting hunter:', response.data.message);
                    alert('Error deleting hunter: ' + response.data.message);
                } else {
                    setLovci(prevLovci => prevLovci.filter(lovac => lovac.broj_lovacke_iskaznice !== broj_lovacke_iskaznice));
                    console.log("Deleted successfully");
                }
            })
            .catch(error => {
                console.error('Error deleting hunter:', error);
                alert('Error deleting hunter');
            });
    };

    // Updated styles
    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#FF6347',
        hover: {
            backgroundColor: '#FF4500'
        }
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        backgroundColor: '#f7f7f7',
        borderRadius: '10px',
        overflow: 'hidden'
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '12px 15px',
        textAlign: 'left',
        fontSize: '14px',
        ':hover': {
            backgroundColor: '#f1f1f1'
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <button onClick={() => navigate('/unos-lovca')} style={buttonStyle}>
                Unesi lovca
            </button>
            <div>
                <h1>Popis Lovaca</h1>
                <table style={tableStyle}>
                    <thead style={thTdStyle}>
                        <tr>
                            <th>Broj iskaznice</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Adresa</th>
                            <th>Datum rođenja</th>
                            <th>Kontakt</th>
                            <th>Korisničko ime</th>
                            <th>Uloga</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lovci.map((lovac) => (
                            <tr key={lovac.broj_lovacke_iskaznice} style={{ ':hover': { backgroundColor: '#f9f9f9' } }}>
                                <td>{lovac.broj_lovacke_iskaznice}</td>
                                <td>{lovac.ime}</td>
                                <td>{lovac.prezime}</td>
                                <td>{lovac.adresa}</td>
                                <td>{lovac.datum_rodjenja}</td>
                                <td>{lovac.kontakt}</td>
                                <td>{lovac.korisnicko_ime}</td>
                                <td>{lovac.uloga}</td>
                                <td>
                                    <button onClick={() => navigate('/a-lovac')} style={buttonStyle}>
                                        Unesi lovca
                                    </button>
                                    <button onClick={() => handleDelete(lovac.broj_lovacke_iskaznice)} style={deleteButtonStyle}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default PopisLovaca;
