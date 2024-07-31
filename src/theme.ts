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

const responsiveStyles = {
  '.custom-image': {
    maxWidth: '100%',
    height: 'auto',
    width: '100%', // デフォルトで幅100%
    [theme.breakpoints.up('sm')]: {
      width: '75%', // sm以上のサイズで幅75%
    },
    [theme.breakpoints.up('md')]: {
      width: '50%', // md以上のサイズで幅50%
    },
    [theme.breakpoints.up('lg')]: {
      width: '33.33%', // lg以上のサイズで幅33.33%
    },
  },
  'a': {
    color: '#4ecdc4', // チョコミントカラー
  },
};

const finalTheme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: responsiveStyles,
    },
  },
});

export default finalTheme;