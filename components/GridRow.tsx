// src/components/GridRow.tsx
import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'; // Removed View import
import Animated from 'react-native-reanimated';
import Tile from './Tile';
import { TileState } from '../types'; // Assuming TileState is defined

export interface GridRowProps { // Added export for GridProps to use
    letters: string[];
    feedback: TileState[];
    style?: StyleProp<ViewStyle>;
}

const GridRow: React.FC<GridRowProps> = ({
    letters,
    feedback,
    style,
}) => {
    return (
        <Animated.View style={[styles.row, style]}>
            {letters.map((letter, index) => (
                <Tile
                    key={index}
                    letter={letter}
                    state={feedback[index] || 'empty'}
                />
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, // Spacing between rows
    },
});

export default GridRow;
