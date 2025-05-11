import {useMemo} from 'react';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const useTheme = () => {
  const theme = useMemo<Theme>(
    () => ({
      dark: false,
      colors: {
        primary: '#007AFF',
        background: '#FFFFFF',
        card: '#F2F2F7',
        text: '#000000',
        border: '#C6C6C8',
        notification: '#FF3B30',
      },
    }),
    [],
  );

  return {theme};
};
