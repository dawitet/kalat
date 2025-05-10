// src/components/Key.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TileState } from '../types';
import { useTheme } from '../providers/ThemeProvider';

interface KeyProps {
    value: string;
    state?: TileState | 'default';
    onClick: (value: string) => void;
    isDisabled?: boolean;
    isSuggestion?: boolean;
    style?: ViewStyle;
    isFunctionKey?: boolean;
}

const Key: React.FC<KeyProps> = React.memo(({
    value,
    state = 'default',
    onClick,
    isDisabled = false,
    isSuggestion = false,
    style,
    isFunctionKey = false,
}) => {
    const { theme } = useTheme();

    const handlePress = () => {
        if (isDisabled) {
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClick(value);
    };

    const styles = StyleSheet.create({
        keyBase: {
            height: 52,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 3,
            marginVertical: 3,
            paddingHorizontal: 5,
            minWidth: 35,
            flex: isFunctionKey ? 1.5 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,
            elevation: 2,
        },
        keyTextBase: {
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
        keyDefault: {
            backgroundColor: theme.colors.keyboard.key.background,
        },
        keyCorrect: {
            backgroundColor: theme.colors.tile.correct,
        },
        keyPresent: {
            backgroundColor: theme.colors.tile.present,
        },
        keyAbsent: {
            backgroundColor: theme.colors.tile.absent,
            opacity: 0.75,
        },
        keySuggestion: {
            backgroundColor: theme.colors.keyboard.suggestion.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            height: 48,
            paddingVertical: 10,
            shadowOpacity: 0.1,
            elevation: 1,
        },
        keyFunction: {
            backgroundColor: theme.colors.keyboard.key.delete,
        },
        textDefault: {
            color: theme.colors.keyboard.key.text,
        },
        textSuggestion: {
            color: theme.colors.text,
        },
        textFeedback: {
            color: theme.colors.tile.feedbackText,
        },
        textFunction: {
            color: theme.colors.keyboard.key.specialText,
        },
        keyDisabled: {
            opacity: 0.5,
        },
    });

    const getKeyStyle = (): ViewStyle => {
        let combinedStyle: ViewStyle = styles.keyBase;

        if (isSuggestion) {
            combinedStyle = { ...combinedStyle, ...styles.keySuggestion };
        } else if (isFunctionKey) {
            combinedStyle = { ...combinedStyle, ...styles.keyFunction };
        } else {
            switch (state) {
                case 'correct': combinedStyle = { ...combinedStyle, ...styles.keyCorrect }; break;
                case 'present': combinedStyle = { ...combinedStyle, ...styles.keyPresent }; break;
                case 'absent': combinedStyle = { ...combinedStyle, ...styles.keyAbsent }; break;
                default: combinedStyle = { ...combinedStyle, ...styles.keyDefault }; break;
            }
        }

        if (isDisabled) {
            combinedStyle = { ...combinedStyle, ...styles.keyDisabled };
        }

        return { ...combinedStyle, ...style };
    };

    const getTextStyle = (): TextStyle => {
        let combinedTextStyle: TextStyle = styles.keyTextBase;

        if (isSuggestion) {
            combinedTextStyle = { ...combinedTextStyle, ...styles.textSuggestion };
        } else if (isFunctionKey) {
            combinedTextStyle = { ...combinedTextStyle, ...styles.textFunction };
        } else if (state === 'correct' || state === 'present' || state === 'absent') {
            combinedTextStyle = { ...combinedTextStyle, ...styles.textFeedback };
        } else {
            combinedTextStyle = { ...combinedTextStyle, ...styles.textDefault };
        }

        if (value.length > 1) {
            combinedTextStyle.fontSize = 14;
        }

        return combinedTextStyle;
    };

    return (
        <TouchableOpacity
            style={getKeyStyle()}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
            accessibilityLabel={value === 'ENTER' ? 'Enter guess' : (value === 'BACKSPACE' ? 'Delete last letter' : `Type letter ${value}`)}
            accessibilityHint={value === 'ENTER' ? 'Submits your current guess' : (value === 'BACKSPACE' ? 'Removes the last entered letter' : 'Adds this letter to your guess')}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
        >
            <Text style={getTextStyle()} allowFontScaling={false}>{value === 'BACKSPACE' ? '⌫' : value}</Text>
        </TouchableOpacity>
    );
});

export default Key;
