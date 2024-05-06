import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ispravno uvođenje jwtDecode

function withAdminProtection(Component) {
    return function ProtectedComponent(props) {
        const navigate = useNavigate();
        const alertShownRef = useRef(false); // Koristimo useRef za praćenje stanja prikazivanja upozorenja
        const token = localStorage.getItem('token');
        let role = null;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                role = decoded.uloga; // Pretpostavljam da 'uloga' postoji u JWT payloadu
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        useEffect(() => {
            if (!token || role !== 'admin') {
                if (!alertShownRef.current) {
                    alertShownRef.current = true; // Postavljamo referencu na true
                    alert('Niste autorizirani za pristup ovoj stranici. Samo administratori mogu pristupiti.');
                    navigate('/pocetna', { replace: true });
                }
            }
        }, [navigate, token, role]); // Uklonili smo alertShown iz ovisnosti

        if (!token || role !== 'admin') {
            return null; // Vraća null ako korisnik nije admin ili ako token nije prisutan
        }

        return <Component {...props} />;
    };
}

export default withAdminProtection;