// src/components/ConfettiWrapper.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { ViewStyle } from 'react-native';
import OptimizedConfetti from './OptimizedConfetti';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface ConfettiPiece {
    id: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    backgroundColor: string;
    type?: string;
    size?: number;
    colors?: string[];
}

interface ConfettiWrapperProps {
    isActive?: boolean;
    pieceCount?: number;
    duration?: number;
    style?: ViewStyle;
    colors?: string[];
}

/**
 * A wrapper component for OptimizedConfetti that handles confetti generation and animation
 */
const ConfettiWrapper: React.FC<ConfettiWrapperProps> = ({
    isActive = false,
    pieceCount = 100,
    duration = 3000,
    style,
    colors = ['#FF5252', '#FFD740', '#00C853', '#2196F3', '#9C27B0', '#FF9800'],
}) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    // Performance monitoring
    const metrics = usePerformanceMonitor({
        componentName: 'ConfettiWrapper',
        enableLogging: __DEV__,
    });

    // Generate confetti pieces only when active
    useMemo(() => {
        if (isActive) {
            const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
                id: `confetti-${i}`,
                x: Math.random() * 400 - 200,
                y: Math.random() * -200,
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 1.5,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                size: 5 + Math.random() * 15,
            }));
            setPieces(newPieces);
        }
    }, [isActive, pieceCount, colors]);

    // Cleanup confetti after duration
    React.useEffect(() => {
        if (isActive && pieces.length > 0) {
            const timer = setTimeout(() => {
                setPieces([]);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, pieces, duration]);

    return (
        <OptimizedConfetti
            pieces={pieces}
            style={style}
            isActive={isActive}
        />
    );
};

export default React.memo(ConfettiWrapper);
