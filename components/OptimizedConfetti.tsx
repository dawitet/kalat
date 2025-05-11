// src/components/OptimizedConfetti.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useCardAnimation } from '../hooks/useCardAnimation';

interface ConfettiPiece {
    id: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    backgroundColor: string;
    type?: string; // Added optional type property
    size?: number; // Added optional size property
    colors?: string[]; // Added optional colors property
}

interface OptimizedConfettiPieceProps {
    piece: ConfettiPiece;
}

// Memoized individual confetti piece for better performance
const OptimizedConfettiPiece: React.FC<OptimizedConfettiPieceProps> = React.memo(({ piece }) => {
    // Use the optimized animation hook for better performance
    const { animStyle } = useCardAnimation(true);

    // Create combined style with the piece properties
    const combinedStyle = useMemo(() => ({
        transform: [
            { translateX: piece.x },
            { translateY: piece.y },
            { rotate: `${piece.rotation}deg` },
            { scale: piece.scale },
        ],
        backgroundColor: piece.backgroundColor,
        width: piece.size || 10,
        height: piece.size || 10,
        borderRadius: (piece.size || 10) / 2,
    }), [piece]);

    return (
        <Animated.View
            style={[styles.confettiPiece, animStyle, combinedStyle]}
        />
    );
}, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    const prevPiece = prevProps.piece;
    const nextPiece = nextProps.piece;

    return (
        prevPiece.id === nextPiece.id &&
        prevPiece.x === nextPiece.x &&
        prevPiece.y === nextPiece.y &&
        prevPiece.rotation === nextPiece.rotation &&
        prevPiece.scale === nextPiece.scale &&
        prevPiece.backgroundColor === nextPiece.backgroundColor &&
        prevPiece.size === nextPiece.size
    );
});

interface OptimizedConfettiProps {
    pieces: ConfettiPiece[];
    style?: ViewStyle;
    isActive?: boolean;
}

// Main optimized confetti component
const OptimizedConfetti: React.FC<OptimizedConfettiProps> = ({ pieces, style, isActive = true }) => {
    // Memoize the confetti pieces list to prevent unnecessary re-renders
    const confettiPieces = useMemo(() => {
        if (!isActive) {return null;}

        return pieces.map(piece => (
            <OptimizedConfettiPiece
                key={piece.id}
                piece={piece}
            />
        ));
    }, [pieces, isActive]);

    // If not active, don't render anything
    if (!isActive) {return null;}

    return (
        <View style={[styles.container, style]}>
            {confettiPieces}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 100,
    },
    confettiPiece: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default React.memo(OptimizedConfetti);
