import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRoutes from './router/routes';
import './App.css'; // Uvoz CSS datoteke

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
        </div>

        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
