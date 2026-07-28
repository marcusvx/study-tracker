import { createContext } from 'react';
import { ThemeContextValue } from './ThemeContext';


export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
