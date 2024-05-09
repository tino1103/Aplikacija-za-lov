import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PopisZivotinja() {
    const [zivotinje, setZivotinje] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-zivotinja', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch animals:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    setZivotinje(response.data.data);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_zivotinje) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati životinju?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/brisi-zivotinju/${sifra_zivotinje}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting animal:', response.data.message);
                        alert('Error deleting animal: ' + response.data.message);
                    } else {
                        setZivotinje(prevZivotinje => prevZivotinje.filter(zivotinja => zivotinja.sifra_zivotinje !== sifra_zivotinje));
                        console.log("Deleted successfully");
                    }
                })
                .catch(error => {
                    console.error('Error deleting animal:', error);
                    alert('Error deleting animal');
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
            <button onClick={() => navigate('/unos-divljaci')} style={buttonStyle}>
                Unesi životinju
            </button>
            <div>
                <h1>Popis Životinja</h1>
                <table style={tableStyle}>
                    <thead style={thTdStyle}>
                        <tr>
                            <th>Vrsta</th>
                            <th>Opis</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zivotinje.map((zivotinja) => (
                            <tr key={zivotinja.sifra_zivotinje} style={{ ':hover': { backgroundColor: '#f9f9f9' } }}>
                                <td>{zivotinja.vrsta_zivotinje}</td>
                                <td>{zivotinja.opis_zivotinje}</td>
                                <td>
                                    <button onClick={() => navigate('/a-divljac', { state: { zivot: zivotinja } })} style={buttonStyle}>
                                        Ažuriraj
                                    </button>
                                    <button onClick={() => handleDelete(zivotinja.sifra_zivotinje)} style={deleteButtonStyle}>Obriši</button>
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

export default PopisZivotinja;