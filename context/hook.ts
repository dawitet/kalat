// src/context/hook.ts
import { useContext } from 'react';
import { GameContext } from './GameContext';
import type { GameContextType } from '../types';

/**
 * Custom hook to access the game context.
 * Throws an error if used outside of a GameProvider.
 */
export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

export type { GameContextType };
