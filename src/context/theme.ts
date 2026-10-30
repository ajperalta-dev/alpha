import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; isDark: boolean }>({
  theme: 'light', toggleTheme: () => {}, isDark: false,
});
export const useTheme = () => useContext(ThemeContext);
