import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginData = {
      korisnicko_ime: korisnickoIme,
      lozinka
    };

    axios.post('http://localhost:3000/prijavi', loginData)
      .then(response => {
        setMessage(`Response: ${response.data.message}`);
      })
      .catch(error => {
        console.error('There was an error!', error);
        setMessage(`Error: ${error.message}`);
      });
  };

  // Styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '50px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#f7f7f7'
  };

  const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ color: '#333' }}>Prijava</h1>
        <div>
          <label style={{ margin: '10px 0', fontWeight: 'bold' }}>Korisničko ime:</label>
          <input
            type="text"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ margin: '10px 0', fontWeight: 'bold' }}>Lozinka:</label>
          <input
            type="password"  // Change type to password for security
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Prijavi</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;
