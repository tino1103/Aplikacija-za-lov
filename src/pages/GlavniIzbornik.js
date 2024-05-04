import React from 'react';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom'; // Ensure Link and useNavigate are imported
import AppRoutes from '../router/Routes';
import '../App.css'; // Import CSS file

function App() {
    return (
        <Router>
            <div className="app-container">
                <h1>Aplikacija za lov</h1>
                <div className="button-container">
                    <Link to="/popis-lovaca"><button className="app-button">Popis lovaca</button></Link>
                    <Link to="/raspored-aktivnosti"><button className="app-button">Raspored</button></Link>
                    <Link to="/Prisutnost"><button className="app-button">Prisutnost u lovu</button></Link>
                    <Link to="/popis-divljaci"><button className="app-button">Popis divljaci</button></Link>
                    <Link to="/popis-ostrjela"><button className="app-button">Ostrjel</button></Link>
                    <Link to="/popis-bodova"><button className="app-button">Bodovi</button></Link>
                    <LogoutButton />
                </div>

                <AppRoutes />
            </div>
        </Router>
    );
}

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clears all local storage data
        navigate('/login'); // Navigates to login page
    };

    return (
        <button onClick={handleLogout} className="app-button1">
            Odjava
        </button>
    );
}

export default App;
