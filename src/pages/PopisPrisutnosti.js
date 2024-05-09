import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function formatDate(dateString) {
    const date = new Date(dateString);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [month, day, year].join('/');
}

function PopisLovacaULovu() {
    const [lovci, setLovci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-lovaca-u-lovu', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch hunters:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedLovci = response.data.data.map(lovac => ({
                        ...lovac,
                        datum_aktivnosti: formatDate(lovac.datum_aktivnosti)
                    }));
                    setLovci(formattedLovci);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_lova) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati ovu stavku?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/popis-brisi/${sifra_lova}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting entry:', response.data.message);
                        alert('Error deleting entry: ' + response.data.message);
                    } else {
                        setLovci(prevLovci => prevLovci.filter(lovac => lovac.sifra_lova !== sifra_lova));
                        alert("Entry successfully deleted");
                    }
                })
                .catch(error => {
                    console.error('Error deleting entry:', error);
                    alert('Error deleting entry');
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
            <button onClick={() => navigate('/unos-prisutnosti')} style={buttonStyle}>
                Unesi prisutnost
            </button>
            <div>
                <h1>Popis Lovaca u Lovu</h1>
                <table style={tableStyle}>
                    <thead style={thTdStyle}>
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Datum Aktivnosti</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lovci.map((lovac) => (
                            <tr key={lovac.sifra_lova} style={{ ':hover': { backgroundColor: '#f9f9f9' } }}>
                                <td>{lovac.ime}</td>
                                <td>{lovac.prezime}</td>
                                <td>{lovac.datum_aktivnosti}</td>
                                <td>
                                    
                                    <button onClick={() => handleDelete(lovac.sifra_lova)} style={deleteButtonStyle}>
                                        Obriši
                                    </button>
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

export default PopisLovacaULovu;
