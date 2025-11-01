import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
    mode: 'light',
    primary: {
      main: '#3F8CFF', // màu chủ đạo
    },
    secondary: {
      main: '#ffffff', // màu phụ
    },
    background: {
      default: '#ffffff',
      paper: '#F4F9FD',
    },
    text: {
      primary: '#0A1629',
      secondary: '#91929E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", "Nunito Sans", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
     h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
     h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 16, // bo góc toàn bộ component
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;