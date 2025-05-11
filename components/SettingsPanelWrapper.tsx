// src/components/SettingsPanelWrapper.tsx
import React from 'react';
import OptimizedSettingsPanel from './OptimizedSettingsPanel';

/**
 * A simple wrapper around the OptimizedSettingsPanel component.
 * This allows for easy integration into the app while keeping the optimized implementation details separate.
 */
const SettingsPanelWrapper: React.FC = () => {
    return <OptimizedSettingsPanel />;
};

export default SettingsPanelWrapper;
