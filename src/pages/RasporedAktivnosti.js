import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function formatDate(dateString) {
    const date = new Date(dateString);
    let day = '' + date.getDate();
    let month = '' + (date.getMonth() + 1);
    let year = date.getFullYear();

    if (day.length < 2)
        day = '0' + day;
    if (month.length < 2)
        month = '0' + month;

    return [year, month, day].join('-'); // Changed to YYYY-MM-DD format for date display
}

function formatTime(timeString) {
    return timeString.substr(0, 5); // Trims time string to HH:MM format
}

function PopisAktivnosti() {
    const [aktivnosti, setAktivnosti] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-aktivnosti', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch activities:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedAktivnosti = response.data.data.map(aktivnost => ({
                        ...aktivnost,
                        datum_aktivnosti: formatDate(aktivnost.datum_aktivnosti),
                        vrijeme_aktivnosti: formatTime(aktivnost.vrijeme_aktivnosti)
                    }));
                    setAktivnosti(formattedAktivnosti);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_aktivnosti) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati aktivnost?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/obrisi-aktivnost/${sifra_aktivnosti}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting activity:', response.data.message);
                        alert('Error deleting activity: ' + response.data.message);
                    } else {
                        setAktivnosti(prevAktivnosti => prevAktivnosti.filter(aktivnost => aktivnost.sifra_aktivnosti !== sifra_aktivnosti));
                        console.log("Deleted successfully");
                    }
                })
                .catch(error => {
                    console.error('Error deleting activity:', error);
                    alert('Error deleting activity');
                });
        }
    };

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
        backgroundColor: '#FF6347'
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
            <button onClick={() => navigate('/unos-rasporeda')} style={buttonStyle}>
                Unesi aktivnost
            </button>
            <div>
                <h1>Popis Aktivnosti</h1>
                <table style={tableStyle}>
                    <thead style={thTdStyle}>
                        <tr>
                            <th>Šifra aktivnosti</th>
                            <th>Naziv aktivnosti</th>
                            <th>Datum aktivnosti</th>
                            <th>Vrijeme aktivnosti</th>
                            <th>Opis aktivnosti</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aktivnosti.map((aktivnost) => (
                            <tr key={aktivnost.sifra_aktivnosti} style={{ ':hover': { backgroundColor: '#f9f9f9' } }}>
                                <td>{aktivnost.sifra_aktivnosti}</td>
                                <td>{aktivnost.naziv_aktivnosti}</td>
                                <td>{aktivnost.datum_aktivnosti}</td>
                                <td>{aktivnost.vrijeme_aktivnosti}</td>
                                <td>{aktivnost.opis_aktivnosti}</td>
                                <td>
                                    <button onClick={() => navigate('/a-raspored', { state: { aktiv: aktivnost } })} style={buttonStyle}>
                                        Ažuriraj
                                    </button>
                                    <button onClick={() => handleDelete(aktivnost.sifra_aktivnosti)} style={deleteButtonStyle}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br></br>
            <button onClick={() => navigate('/glavni-izbornik')} style={buttonStyle}>
                Odustani
            </button>
        </div>
    );
}

export default PopisAktivnosti;
