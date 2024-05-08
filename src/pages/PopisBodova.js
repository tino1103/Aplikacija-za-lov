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

    return [day, month, year.toString().substr(-2)].join('/');
}

function PopisBodova() {
    const [bodovi, setBodovi] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios.get('http://localhost:3000/popis-bodova', config)
            .then(response => {
                if (response.data.error) {
                    console.error('Failed to fetch points and associated hunter data:', response.data.message);
                    alert('Error: ' + response.data.message);
                } else {
                    const formattedBodovi = response.data.data.map(bod => ({
                        ...bod,
                        datum_rodjenja: formatDate(bod.datum_rodjenja)
                    }));
                    setBodovi(formattedBodovi);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleDelete = (sifra_dodijeljenog_boda) => {
        const confirmDelete = window.confirm("Da li stvarno želite izbrisati ovaj bod?");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Correct the URL to match the server's endpoint
            axios.delete(`http://localhost:3000/obrisi-bodove/${sifra_dodijeljenog_boda}`, config)
                .then(response => {
                    if (response.data.error) {
                        console.error('Error deleting point:', response.data.message);
                        alert('Error deleting point: ' + response.data.message);
                    } else {
                        setBodovi(prevBodovi => prevBodovi.filter(bod => bod.sifra_dodijeljenog_boda !== sifra_dodijeljenog_boda));
                        console.log("Deleted successfully");
                    }
                })
                .catch(error => {
                    console.error('Error deleting point:', error);
                    alert('Error deleting point');
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
            <button onClick={() => navigate('/unos-bodova')} style={buttonStyle}>
                Unesi bod
            </button>
            <div>
                <h1>Popis Bodova</h1>
                <table style={tableStyle}>
                    <thead style={thTdStyle}>
                        <tr>
                            <th>Šifra dodijeljenog boda</th>
                            <th>Broj bodova</th>
                            <th>Opis</th>
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
                        {bodovi.map((bod) => (
                            <tr key={bod.sifra_dodijeljenog_boda} style={{ ':hover': { backgroundColor: '#f9f9f9' } }}>
                                <td>{bod.sifra_dodijeljenog_boda}</td>
                                <td>{bod.broj_bodova}</td>
                                <td>{bod.opis_dodijeljenog_boda}</td>
                                <td>{bod.broj_lovacke_iskaznice}</td>
                                <td>{bod.ime}</td>
                                <td>{bod.prezime}</td>
                                <td>{bod.adresa}</td>
                                <td>{bod.datum_rodjenja}</td>
                                <td>{bod.kontakt}</td>
                                <td>{bod.korisnicko_ime}</td>
                                <td>{bod.uloga}</td>
                                <td>
                                    <button onClick={() => navigate('/a-bodovi', { state: { bodovi: bod } })} style={buttonStyle}>
                                        Ažuriraj
                                    </button>
                                    <button onClick={() => handleDelete(bod.sifra_dodijeljenog_boda)} style={deleteButtonStyle}>Delete</button>
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

export default PopisBodova;
