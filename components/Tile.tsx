// src/components/Tile.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { TileState } from '../types';

export interface TileProps {
    letter?: string;
    state?: TileState;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Tile: React.FC<TileProps> = ({
    letter = '',
    state = 'empty',
    style,
    textStyle,
}) => {
    const { theme } = useTheme();

    const tileDynamicStyles: ViewStyle = {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.primary, // Placeholder for theme.colors.background
    };
    const textDynamicStyles: TextStyle = {
        color: theme.colors.text,
    };

    switch (state) {
        case 'correct':
            tileDynamicStyles.backgroundColor = theme.colors.accent; // Placeholder for theme.colors.correct
            tileDynamicStyles.borderColor = theme.colors.accent;   // Placeholder for theme.colors.correct
            textDynamicStyles.color = theme.colors.text;         // Placeholder for theme.colors.tileText
            break;
        case 'present':
            tileDynamicStyles.backgroundColor = theme.colors.secondary; // Placeholder for theme.colors.present
            tileDynamicStyles.borderColor = theme.colors.secondary;   // Placeholder for theme.colors.present
            textDynamicStyles.color = theme.colors.text;          // Placeholder for theme.colors.tileText
            break;
        case 'absent':
            tileDynamicStyles.backgroundColor = theme.colors.hint; // Placeholder for theme.colors.absent
            tileDynamicStyles.borderColor = theme.colors.hint;   // Placeholder for theme.colors.absent
            textDynamicStyles.color = theme.colors.text;         // Placeholder for theme.colors.tileText
            break;
        case 'empty':
            // Default styles are applied
            // If 'tbd' was a distinct visual state, handle it here or add to TileState
            // For now, treating 'tbd' like 'empty' or ensuring it uses default text color if letter exists
            if (letter) {
                textDynamicStyles.color = theme.colors.text;
            }
            break;
        // Removed 'tbd' case as it's not in TileState, its logic merged with 'empty' or needs TileState update
    }

    return (
        <View style={[styles.tile, tileDynamicStyles, style]}>
            <Text style={[styles.text, textDynamicStyles, textStyle]}>
                {letter?.toUpperCase()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tile: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        margin: 3,
        borderRadius: 5,
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
    },
});

export default Tile;
