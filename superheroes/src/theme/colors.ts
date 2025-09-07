export const colors = {
  // Primary colors - Brand color #261851
  primary: {
    50: '#f0f0f5',
    100: '#e0e0eb',
    200: '#c1c1d7',
    300: '#a2a2c3',
    400: '#8383af',
    500: '#261851', // Brand color
    600: '#1e1340',
    700: '#160e2f',
    800: '#0e091e',
    900: '#06040d',
  },
  
  // Secondary colors
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background colors
  background: {
    primary: '#261851', // Brand color
    secondary: '#1e1340',
    tertiary: '#160e2f',
    card: '#2a1d5a',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
    tertiary: '#737373',
    inverse: '#000000',
  },
  
  // Border colors
  border: {
    primary: '#262626',
    secondary: '#404040',
    focus: '#0ea5e9',
  },
  
  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = typeof colors[ColorKey];
