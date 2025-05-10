import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

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

interface ConfettiProps {
    pieces: ConfettiPiece[];
    style?: ViewStyle;
}

const Confetti: React.FC<ConfettiProps> = ({ pieces, style }) => {
    return (
        <View style={[styles.container, style]}>
            {pieces.map((piece) => (
                <Animated.View
                    key={piece.id}
                    style={[
                        styles.confettiPiece,
                        {
                            transform: [
                                { translateX: piece.x },
                                { translateY: piece.y },
                                { rotate: `${piece.rotation}deg` },
                                { scale: piece.scale },
                            ],
                            backgroundColor: piece.backgroundColor,
                        },
                    ]}
                />
            ))}
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
    },
    confettiPiece: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default Confetti;
