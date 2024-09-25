import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import '@fontsource/roboto';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.custom-image': {
          maxWidth: '100%',
          height: 'auto',
          width: '100%', // デフォルトで幅100%
          '@media (min-width:600px)': {
            width: '75%', // sm以上のサイズで幅75%
          },
          '@media (min-width:960px)': {
            width: '50%', // md以上のサイズで幅50%
          },
        },
      },
    },
  },
});

export default theme;