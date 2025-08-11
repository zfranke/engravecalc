import { createTheme } from '@mui/material/styles';

const base = {
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { border: '1px solid rgba(255,255,255,0.08)' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
  typography: { fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Helvetica','Arial'].join(',') },
};

export const THEMES = {
  light: createTheme({
    ...base,
    palette: {
      mode: 'light',
      primary: { main: '#2f6feb' },
      secondary: { main: '#7c3aed' },
      background: { default: '#f8fafc', paper: '#ffffff' }
    }
  }),
  dark: createTheme({
    ...base,
    palette: {
      mode: 'dark',
      primary: { main: '#7aa2ff' },
      secondary: { main: '#a78bfa' },
      background: { default: '#0b0b0c', paper: '#121214' },
      divider: 'rgba(255,255,255,0.08)',
    }
  }),
  forest: createTheme({
    ...base,
    palette: {
      mode: 'dark',
      primary: { main: '#6ee7b7' },     // mint
      secondary: { main: '#10b981' },   // emerald
      background: { default: '#0b1411', paper: '#101b17' },
    }
  }),
  ocean: createTheme({
    ...base,
    palette: {
      mode: 'dark',
      primary: { main: '#60a5fa' },
      secondary: { main: '#22d3ee' },
      background: { default: '#0a1220', paper: '#0f1a2e' },
    }
  }),
  desert: createTheme({
    ...base,
    palette: {
      mode: 'dark',
      primary: { main: '#f59e0b' },     // amber
      secondary: { main: '#eab308' },
      background: { default: '#1a140d', paper: '#23170c' },
    }
  }),
};
