// src/components/DifficultySelector.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useTheme } from '../providers/ThemeProvider';
import { Difficulty } from '../types'; // Assuming Difficulty type is defined

const DifficultySelector: React.FC = () => {
    const context = useContext(GameContext);
    const { theme } = useTheme();

    if (!context) {
        return <Text>Loading...</Text>;
    }

    const { gameState, dispatch } = context;

    const handleSelectDifficulty = (difficulty: Difficulty) => {
        if (gameState.currentDifficulty === difficulty && gameState.activeModal === null) {
            return;
        }
        // TODO: Verify 'SET_CURRENT_DIFFICULTY' is the correct action type
        dispatch({ type: 'SET_CURRENT_DIFFICULTY' as any, payload: difficulty });
    };

    const handleStartGame = () => {
        if (!gameState.currentDifficulty) {
            Alert.alert('ችግር ይምረጡ', 'ለመጀመር እባክዎ የችግር ደረጃ ይምረጡ።');
            return;
        }
        // TODO: Verify 'INITIALIZE_GAME' is the correct action type
        dispatch({ type: 'INITIALIZE_GAME' as any });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: theme.colors.primary, // Placeholder: theme.colors.background,
            paddingBottom: Platform.OS === 'web' ? 70 : 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 30,
            textAlign: 'center',
        },
        buttonContainer: {
            flexDirection: Platform.OS === 'web' ? 'row' : 'column',
            justifyContent: Platform.OS === 'web' ? 'space-around' : 'center',
            width: '100%',
            maxWidth: 500,
            marginBottom: 30,
        },
        difficultyButton: {
            backgroundColor: theme.colors.secondary,
            paddingVertical: 15,
            paddingHorizontal: 25,
            borderRadius: 10,
            margin: 10,
            borderWidth: 2,
            borderColor: 'transparent',
            alignItems: 'center',
            minWidth: Platform.OS === 'web' ? 150 : undefined,
        },
        selectedButton: {
            borderColor: theme.colors.accent,
            backgroundColor: theme.colors.accent, // Placeholder: theme.colors.accentFaded,
        },
        buttonText: {
            fontSize: 18,
            color: theme.colors.text,
            fontWeight: '600',
        },
        startButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 18,
            paddingHorizontal: 40,
            borderRadius: 12,
            marginTop: 20,
        },
        startButtonText: {
            fontSize: 20,
            color: theme.colors.buttonText,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>የችግር ደረጃ ይምረጡ</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.difficultyButton,
                        gameState.currentDifficulty === 'easy' && styles.selectedButton,
                    ]}
                    onPress={() => handleSelectDifficulty('easy')}
                    accessibilityLabel="ቀላል የችግር ደረጃ ይምረጡ"
                >
                    <Text style={styles.buttonText}>ቀላል</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.difficultyButton,
                        gameState.currentDifficulty === 'hard' && styles.selectedButton,
                    ]}
                    onPress={() => handleSelectDifficulty('hard')}
                    accessibilityLabel="ከባድ የችግር ደረጃ ይምረጡ"
                >
                    <Text style={styles.buttonText}>ከባድ</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartGame}
                disabled={!gameState.currentDifficulty}
            >
                <Text style={styles.startButtonText}>ጀምር</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DifficultySelector;
