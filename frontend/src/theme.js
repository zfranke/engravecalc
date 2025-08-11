import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0b0b0c', paper: '#121214' },
    primary: { main: '#7aa2ff' },
    secondary: { main: '#a78bfa' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { border: '1px solid rgba(255,255,255,0.08)' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Helvetica','Arial'].join(','),
  },
});
