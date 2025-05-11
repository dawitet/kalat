import {useState, useCallback} from 'react';

interface Settings {
  theme: string; // Changed ThemeType to string as a placeholder
  soundEffects: boolean;
  hapticFeedback: boolean;
}

const defaultSettings: Settings = {
  theme: 'system',
  soundEffects: true,
  hapticFeedback: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({...prev, ...newSettings}));
  }, []);

  return {
    settings,
    updateSettings,
  };
};
