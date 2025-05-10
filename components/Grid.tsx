// src/components/Grid.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import GridRow, { GridRowProps } from './GridRow'; // Import GridRowProps
import { TileState } from '../types';

interface GridProps {
    guesses: string[][];
    feedback: TileState[][];
    currentRow: number;
    currentGuess: string;
    wordLength: number;
    maxGuesses: number;
    style?: StyleProp<ViewStyle>;
}

const Grid: React.FC<GridProps> = ({
    guesses,
    feedback,
    currentRow,
    currentGuess,
    wordLength,
    maxGuesses,
    style,
}) => {
    const emptyRows = maxGuesses - guesses.length > 0 ? Array.from(new Array(maxGuesses - guesses.length)) : [];

    return (
        <View style={[styles.gridContainer, style]}>
            {guesses.map((guess, rowIndex) => {
                const isCurrentRow = rowIndex === currentRow;
                const displayGuess = isCurrentRow ? currentGuess.padEnd(wordLength, ' ') : guess.join('');
                const currentFeedback = feedback[rowIndex] || Array(wordLength).fill('empty');

                const gridRowProps: GridRowProps = {
                    letters: displayGuess.split(''),
                    feedback: currentFeedback,
                };

                return (
                    <GridRow
                        key={`guess-${rowIndex}`}
                        {...gridRowProps}
                    />
                );
            })}
            {emptyRows.map((_item, rowIndex) => {
                const gridRowProps: GridRowProps = {
                    letters: Array(wordLength).fill(''),
                    feedback: Array(wordLength).fill('empty'),
                };
                return (
                    <GridRow
                        key={`empty-${rowIndex + guesses.length}`}
                        {...gridRowProps}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
});

export default Grid;
