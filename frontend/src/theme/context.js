import { createContext, useContext } from 'react';

export const ThemeNameCtx = createContext({ name: 'dark', setName: () => {} });

export function useThemeName() {
  return useContext(ThemeNameCtx);
}
