// routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PopisBodova from '../pages/PopisBodova';
import LoginPage from '../pages/LoginPage';
import PopisDivljaci from '../pages/PopisDivljaci';
import Prisutnost from '../pages/Prisutnost';
import PopisLovaca from '../pages/PopisLovaca';
import PopisOstrjela from '../pages/PopisOstrjela';
import RasporedAktivnosti from '../pages/RasporedAktivnosti';
import UnosBodova from '../pages/UnosBodova';
import UnosDivljaci from '../pages/UnosDivljaci';
import UnosLovca from '../pages/UnosLovca';
import UnosOstrjela from '../pages/UnosOstrjela';
import UnosRasporeda from '../pages/UnosRasporeda';
import GlavniIzbornik from '../pages/GlavniIzbornik';


const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/popis-bodova" element={<PopisBodova />} />
        <Route path="/popis-divljaci" element={<PopisDivljaci />} />
        <Route path="/Prisutnost" element={<Prisutnost />} />
        <Route path="/popis-lovaca" element={<PopisLovaca />} />
        <Route path="/popis-ostrjela" element={<PopisOstrjela />} />
        <Route path="/raspored-aktivnosti" element={<RasporedAktivnosti />} />
        <Route path="/unos-bodova" element={<UnosBodova />} />
        <Route path="/unos-divljaci" element={<UnosDivljaci />} />
        <Route path="/unos-lovca" element={<UnosLovca />} />
        <Route path="/unos-ostrjela" element={<UnosOstrjela />} />
        <Route path="/unos-rasporeda" element={<UnosRasporeda />} />
        <Route path="/glavni-izbornik" element={<GlavniIzbornik />} />

    </Routes>
);

export default AppRoutes;
