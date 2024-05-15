import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Zelena
    },
    secondary: {
      main: '#8B4513', // Smeđa
    },
    background: {
      default: '#eee', // Svijetlo siva
    },
    text: {
      primary: '#2E2E2E', // Tamno siva
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#2E2E2E', // Tamno siva
    },
    button: {
      textTransform: 'none',
      fontSize: '16px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '8px',
        },
      },
    },
  },
});

export default theme;
