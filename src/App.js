import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PopisBodova from './pages/PopisBodova';
import LoginPage from './pages/LoginPage';
import PopisDivljaci from './pages/PopisDivljaci';
import Prisutnost from './pages/PopisPrisutnosti.js';
import PopisLovaca from './pages/PopisLovaca';
import PopisOstrjela from './pages/PopisOstrjela';
import RasporedAktivnosti from './pages/RasporedAktivnosti';
import UnosBodova from './pages/UnosBodova';
import UnosDivljaci from './pages/UnosDivljaci';
import UnosLovca from './pages/UnosLovca';
import UnosOstrjela from './pages/UnosOstrjela';
import UnosRasporeda from './pages/UnosRasporeda';
import GlavniIzbornik from './pages/GlavniIzbornik';
import PrijvaLovac from './pages/LovacLogin';
import PocetnaStranica from './pages/Pocetna';
import IzLovac from './pages/IzbornikLovac.js';
import UpLovac from './pages/AzurirajLovca.js';
import UpDivljaci from './pages/AzurirajDivljac.js';
import UpRaspored from './pages/AzurirajRaspored.js';
import withAdminProtection from './withAdminProtection';  // Ažurirajte putanju do vaše HOC datoteke ako je potrebno
import QrKod from './pages/QRCodeDisplay.js';
import SkeniranjeKoda from './pages/SkeniranjeKoda.js';






function App() {
  const PopisLovacaProtected = withAdminProtection(PopisLovaca); // Primjenjujemo HOC na PopisLovaca komponentu

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/popis-bodova" element={<PopisBodova />} />
        <Route path="/popis-divljaci" element={<PopisDivljaci />} />
        <Route path="/popis-prisutnosti" element={<Prisutnost />} />
        <Route path="/popis-lovaca" element={<PopisLovacaProtected />} /> {/* Koristi zaštićenu komponentu */}
        <Route path="/popis-ostrjela" element={<PopisOstrjela />} />
        <Route path="/raspored-aktivnosti" element={<RasporedAktivnosti />} />
        <Route path="/unos-bodova" element={<UnosBodova />} />
        <Route path="/unos-divljaci" element={<UnosDivljaci />} />
        <Route path="/unos-lovca" element={<UnosLovca />} />
        <Route path="/unos-ostrjela" element={<UnosOstrjela />} />
        <Route path="/unos-rasporeda" element={<UnosRasporeda />} />
        <Route path="/glavni-izbornik" element={<GlavniIzbornik />} />
        <Route path="/prijava-lovac" element={<PrijvaLovac />} />
        <Route path="/pocetna" element={<PocetnaStranica />} />
        <Route path="/izbornik-lovac" element={<IzLovac />} />
        <Route path="/a-lovac" element={<UpLovac />} />
        <Route path="/a-divljac" element={<UpDivljaci />} />
        <Route path="/a-raspored" element={<UpRaspored />} />
        <Route path="/qr" element={<QrKod />} />
        <Route path="/skeniranje-koda" element={<SkeniranjeKoda />} />








        {/* Automatically redirect to the login page if no other routes match */}
        <Route path="*" element={<Navigate to="/pocetna" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
