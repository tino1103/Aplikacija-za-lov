import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PopisOstreljeneDivljaci() {
    const [ostreljeneDivljaci, setOstreljeneDivljaci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-ostreljene-zivotinje', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch culled animals:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedData = response.data.data.map(item => ({
                        ...item,
                        datum_odstrijela: formatDate(item.datum_odstrijela) 
                    }));
                    setOstreljeneDivljaci(formattedData);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return [
            ('0' + date.getDate()).slice(-2),
            ('0' + (date.getMonth() + 1)).slice(-2),
            date.getFullYear(),
        ].join('/');
    }

    const handleDelete = (sifra_odstrijela) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati odstrijeljenu divljač?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`http://localhost:3000/brisi-odstrijel/${sifra_odstrijela}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting culled animal:', response.data.message);
                        alert('Error deleting culled animal: ' + response.data.message);
                    } else {
                        setOstreljeneDivljaci(prevDivljaci => prevDivljaci.filter(divljac => divljac.sifra_odstrijela !== sifra_odstrijela));
                        alert("Odstrijeljena divljač uspješno izbrisana.");
                    }
                })
                .catch(error => {
                    console.error('Error deleting culled animal:', error);
                    alert('Error deleting culled animal');
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
        fontSize: '14px'
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
            <button onClick={() => navigate('/unos-ostrjela')} style={buttonStyle}>
                Unesi odstrijel
            </button>
            <h1>Popis Ostrjeljene Divljaci</h1>
            <table style={tableStyle}>
                <thead style={thTdStyle}>
                    <tr>
                        <th>Ime Lovca</th>
                        <th>Prezime Lovca</th>
                        <th>Vrsta Životinje</th>
                        <th>Datum Odstrijela</th>
                        <th>Vrijeme Odstrijela</th>
                        <th>Lokacija Odstrijela</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {ostreljeneDivljaci.map((divljac, index) => (
                        <tr key={index}>
                            <td>{divljac.ime_lovca}</td>
                            <td>{divljac.prezime_lovca}</td>
                            <td>{divljac.vrsta_zivotinje}</td>
                            <td>{divljac.datum_odstrijela}</td>
                            <td>{divljac.vrijeme_odstrijela}</td>
                            <td>{divljac.lokacija_odstrijela}</td>
                            <td>
                                <button onClick={() => handleDelete(divljac.sifra_odstrijela)} style={deleteButtonStyle}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            <button onClick={() => navigate('/glavni-izbornik')} style={buttonStyle}>
                Odustani
            </button>
        </div>
    );
}

export default PopisOstreljeneDivljaci;
