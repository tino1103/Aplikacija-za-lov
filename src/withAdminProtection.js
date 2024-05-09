import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function withAdminProtection(Component) {
    return function ProtectedComponent(props) {
        const navigate = useNavigate();
        const alertShownRef = useRef(false); 
        const token = localStorage.getItem('token');
        let role = null;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                role = decoded.uloga; 
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        useEffect(() => {
            if (!token || role !== 'admin') {
                if (!alertShownRef.current) {
                    alertShownRef.current = true; 
                    alert('Niste autorizirani za pristup ovoj stranici. Samo administratori mogu pristupiti.');
                    navigate('/pocetna', { replace: true });
                }
            }
        }, [navigate, token, role]); 

        if (!token || role !== 'admin') {
            return null; 
        }

        return <Component {...props} />;
    };
}

export default withAdminProtection;