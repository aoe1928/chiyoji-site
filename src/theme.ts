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
      fontSize: '3rem', // フォントサイズを調整
    },
    h2: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem', // フォントサイズを調整
    },
    subtitle1: {
      fontSize: '0.875rem', // 日付のフォントサイズを調整
    },
  },
});

export default theme;