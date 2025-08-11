import { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { storage } from '../lib/storage';
import { THEMES } from './palettes';
import { ThemeNameCtx } from './context'; 

export default function ThemingProvider({ children }) {
  const [name, setName] = useState(storage.get('themeName', 'dark'));
  const theme = useMemo(() => THEMES[name] || THEMES.dark, [name]);

  const api = useMemo(() => ({
    name,
    setName: (n) => { storage.set('themeName', n); setName(n); }
  }), [name]);

  return (
    <ThemeNameCtx.Provider value={api}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeNameCtx.Provider>
  );
}
