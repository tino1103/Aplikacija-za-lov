import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PopisDivljaci.css';

function PopisZivotinja() {
    const [zivotinje, setZivotinje] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('getSveZivotinje');
                setZivotinje(response.data);
            } catch (error) {
                console.error('Došlo je do greške pri dohvaćanju podataka', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="popis-bodova-container">
            <header className="header">
                <h1>Životinje</h1>
            </header>
            <table className="user-list">
                <thead>
                    <tr>
                        <th>Naziv</th> 
                        <th>Opis</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {zivotinje.map((zivotinja, index) => ( 
                        <tr key={index}>
                            <td>{zivotinja.naziv_zivotinje}</td>
                            <td>{zivotinja.opis_zivotinje}</td>
                            <td>
                                <button className="icon-button edit-button">
                                    <i className="edit-icon">✎</i> {}
                                </button>
                                <button className="icon-button checkbox-button">
                                    <i className="checkbox-icon">☐</i> {}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PopisZivotinja;
