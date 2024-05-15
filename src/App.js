import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './pages/tema.js'; 
import './App.css'; 
import GlavniIzbornik from './pages/GlavniIzbornik';
import LoginPage from './pages/LoginPage';
import PopisLovaca from './pages/PopisLovaca';
import PopisDivljaci from './pages/PopisDivljaci';
import Prisutnost from './pages/PopisPrisutnosti.js';
import PopisOstrjela from './pages/PopisOstrjela';
import KorisnikPopisOstrjela from './pages/KorisnikOstrjel.js';
import RasporedAktivnosti from './pages/RasporedAktivnosti';
import KorisnikRasporedAktivnosti from './pages/KorisnikRasporedAktivnosti';
import UnosBodova from './pages/UnosBodova';
import UnosDivljaci from './pages/UnosDivljaci';
import UnosLovca from './pages/UnosLovca';
import UnosOstrjela from './pages/UnosOstrjela';
import KorisnikUO from './pages/LovacUO';
import UnosRasporeda from './pages/UnosRasporeda';
import PrijvaLovac from './pages/LovacLogin';
import PocetnaStranica from './pages/Pocetna';
import IzLovac from './pages/IzbornikLovac.js';
import UpLovac from './pages/AzurirajLovca.js';
import UpDivljaci from './pages/AzurirajDivljac.js';
import UpBod from './pages/AzurirajBodove.js';
import UpRaspored from './pages/AzurirajRaspored.js';
import withAdminProtection from './withAdminProtection';
import QrKod from './pages/QRCodeDisplay.js';
import QrKodKorisnik from './pages/KorisnikQr.js';
import UnosPrisutnosti from './pages/UnosLuLov.js';
import PopisBodova from './pages/PopisBodova.js';

const PopisLovacaProtected = withAdminProtection(PopisLovaca);
const PopisDivljaciProtected = withAdminProtection(PopisDivljaci);
const PopisBodovaProtected = withAdminProtection(PopisBodova); // Popravi ovo ime
const PopisPrisutnostiProtected = withAdminProtection(Prisutnost);
const PopisOstrjelaProtected = withAdminProtection(PopisOstrjela);
const RasporedAktivnostiProtected = withAdminProtection(RasporedAktivnosti);
const UnosBodovaProtected = withAdminProtection(UnosBodova);
const UnosDivljaciProtected = withAdminProtection(UnosDivljaci);
const UnosLovcaProtected = withAdminProtection(UnosLovca);
const UnosOstrjelaProtected = withAdminProtection(UnosOstrjela);
const UnosPrisutnostiProtected = withAdminProtection(UnosPrisutnosti);
const UnosRasporedaProtected = withAdminProtection(UnosRasporeda);
const GlavniIzbornikProtected = withAdminProtection(GlavniIzbornik);
const QrKodProtected = withAdminProtection(QrKod);
const UpLovacProtected = withAdminProtection(UpLovac);
const UpDivljaciProtected = withAdminProtection(UpDivljaci);
const UpBodProtected = withAdminProtection(UpBod);
const UpRasporedProtected = withAdminProtection(UpRaspored);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/popis-bodova" element={<PopisBodovaProtected />} />
          <Route path="/popis-divljaci" element={<PopisDivljaciProtected />} />
          <Route path="/popis-prisutnosti" element={<PopisPrisutnostiProtected />} />
          <Route path="/popis-lovaca" element={<PopisLovacaProtected />} />
          <Route path="/popis-ostrjela" element={<PopisOstrjelaProtected />} />
          <Route path="/korisnik-popis-ostrjela" element={<KorisnikPopisOstrjela />} />
          <Route path="/raspored-aktivnosti" element={<RasporedAktivnostiProtected />} />
          <Route path="/korisnik-raspored-aktivnosti" element={<KorisnikRasporedAktivnosti />} />
          <Route path="/unos-bodova" element={<UnosBodovaProtected />} />
          <Route path="/unos-divljaci" element={<UnosDivljaciProtected />} />
          <Route path="/unos-lovca" element={<UnosLovcaProtected />} />
          <Route path="/unos-ostrjela" element={<UnosOstrjelaProtected />} />
          <Route path="/korisnik-unos-ostrjela" element={<KorisnikUO />} />
          <Route path="/unos-prisutnosti" element={<UnosPrisutnostiProtected />} />
          <Route path="/unos-rasporeda" element={<UnosRasporedaProtected />} />
          <Route path="/glavni-izbornik" element={<GlavniIzbornikProtected />} />
          <Route path="/prijava-lovac" element={<PrijvaLovac />} />
          <Route path="/pocetna" element={<PocetnaStranica />} />
          <Route path="/izbornik-lovac" element={<IzLovac />} />
          <Route path="/a-lovac" element={<UpLovacProtected />} />
          <Route path="/a-divljac" element={<UpDivljaciProtected />} />
          <Route path="/a-raspored" element={<UpRasporedProtected />} />
          <Route path="/a-bodovi" element={<UpBodProtected />} />
          <Route path="/qr-korisnik" element={<QrKodKorisnik />} />
          <Route path="/qr" element={<QrKodProtected />} />
          <Route path="*" element={<Navigate to="/pocetna" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
