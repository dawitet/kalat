// src/mobile/components/modals/StreakModal.tsx OR src/screens/StreakScreen.tsx
import React, { useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withDelay,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';

// Context Hook
import { GameContext } from '../../context/GameContext'; // Adjust path
import { useTheme } from '../../providers/ThemeProvider'; // Adjust path

const StreakModal: React.FC = () => {
    const context = useContext(GameContext);
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    // Animation values for each card
    const card1Anim = useSharedValue(0);
    const card2Anim = useSharedValue(0);
    const card3Anim = useSharedValue(0);

    useEffect(() => {
        const springConfig = { damping: 12, stiffness: 100, mass: 0.8 };
        card1Anim.value = withDelay(50, withSpring(1, springConfig));
        card2Anim.value = withDelay(150, withSpring(1, springConfig));
        card3Anim.value = withDelay(250, withSpring(1, springConfig));
    }, [card1Anim, card2Anim, card3Anim]);

    const useAnimatedCardStyle = (animValue: Animated.SharedValue<number>) => {
        return useAnimatedStyle(() => ({
            opacity: animValue.value,
            transform: [{
                scale: interpolate(animValue.value, [0, 1], [0.8, 1], Extrapolate.CLAMP),
            }, {
                translateY: interpolate(animValue.value, [0, 1], [20, 0], Extrapolate.CLAMP),
            }],
        }));
    };

    const animatedCard1Style = useAnimatedCardStyle(card1Anim);
    const animatedCard2Style = useAnimatedCardStyle(card2Anim);
    const animatedCard3Style = useAnimatedCardStyle(card3Anim);

    const { // Moved destructuring after hooks
        userId,
        currentStreak = 0,
        maxStreak = 0,
        bestTimeHard = null,
        guessesInBestTimeHardGame = null,
    } = context?.gameState || {}; // Added null check for context and gameState

    const handleShareStreak = useCallback(async () => {
        if (currentStreak === 0 && maxStreak === 0 && bestTimeHard === null) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('ምንም የለም', 'ለማጋራት ምንም ጉዞ የለም። መጀመሪያ ጨዋታ ይጫወቱ!');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const WEBAPP_URL = 'https://example.com'; // Placeholder for WEBAPP_URL
        const shareMessage = `🔥 የኔ የቃላት ጉዞ፦ ${currentStreak} (ከፍተኛ፦ ${maxStreak})!\n\nቃላት ይጫወቱ! ${WEBAPP_URL}`;

        try {
            await Share.share({
                message: shareMessage,
            });
        } catch (error: any) {
            console.error('Error sharing streak:', error);
            Alert.alert('ስህተት', 'ጉዞውን ማጋራት አልተቻለም: ' + error.message);
        }
    }, [currentStreak, maxStreak, bestTimeHard]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 20, // For content before footer
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center', // Center title
            marginBottom: 20,
            position: 'relative', // For absolute positioning share button
            minHeight: 40, // Ensure space for share button
        },
        profileName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
        },
        shareButton: {
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: [{ translateY: -16 }], // Adjust based on icon size
            padding: 8,
        },
        shareIcon: {
            width: 28, // Slightly larger
            height: 28,
            tintColor: theme.colors.link, // Use theme link color for icon
        },
        profileImageContainer: {
            alignItems: 'center',
            marginBottom: 25,
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: theme.colors.accent,
        },
        defaultProfileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.accent,
        },
        defaultProfileText: { // For initial letter if no image
            fontSize: 36,
            color: theme.colors.text,
            fontWeight: 'bold',
        },
        cardsWrapper: {
            flexDirection: Platform.OS === 'web' ? 'row' : 'column', // Row for web-like, column for mobile
            justifyContent: 'space-around',
            alignItems: Platform.OS === 'web' ? 'stretch' : 'center',
        },
        card: {
            backgroundColor: theme.colors.secondary,
            borderRadius: 12,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: Platform.OS === 'web' ? 110 : '80%', // Adjust width
            height: Platform.OS === 'web' ? 160 : undefined,
            marginVertical: Platform.OS === 'web' ? 5 : 10,
            marginHorizontal: Platform.OS === 'web' ? 5 : 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cardIcon: {
            fontSize: 28, // Larger icon
            marginBottom: 10,
        },
        cardValue: {
            fontSize: 22, // Larger value
            fontWeight: 'bold',
            color: theme.colors.accent, // Use theme accent
            marginBottom: 5,
        },
        cardLabel: {
            fontSize: 13,
            color: theme.colors.hint,
            textAlign: 'center',
            lineHeight: 18,
        },
        cardSubLabel: {
            fontSize: 11,
            color: theme.colors.hint,
            marginTop: 4,
            textAlign: 'center',
        },
        footer: {
            paddingVertical: 15,
            paddingBottom: insets.bottom + 15,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.secondary,
            alignItems: 'center',
        },
        footerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 8,
            backgroundColor: theme.colors.buttonText,
        },
        footerIcon: {
            width: 22,
            height: 22,
            marginRight: 10,
            tintColor: theme.colors.buttonText,
        },
        footerButtonText: {
            fontSize: 16,
            color: theme.colors.buttonText,
            fontWeight: '600',
        },
         errorPlaceholder: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            fontSize: 16,
            color: theme.colors.destructive,
            textAlign: 'center',
        },
    });

    if (!context || !context.gameState) { // Check if context or gameState is null/undefined
        console.error('GameContext or gameState is not available in StreakModal');
        return (
            <View style={styles.container}>
                <Text>Error: Game data is unavailable.</Text>
            </View>
        );
    }

    // Derive username from userId or use a default
    const username = userId ? `ተጫዋች ${userId.substring(0, 5)}` : 'ገማች';

    const formatTime = (timeInSeconds: number | null | undefined): string => {
        if (typeof timeInSeconds !== 'number' || timeInSeconds < 0) { return 'N/A'; }
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60); // No decimals for simpler display
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const displayBestTime = formatTime(bestTimeHard);

    if (!userId) { // Check if any user identifier exists
        return (
            <View style={[styles.container, styles.errorPlaceholder]}>
                <Text style={styles.errorText}>
                    የተጠቃሚ መረጃን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.profileName}>{username}</Text>
                    {(currentStreak > 0 || maxStreak > 0 || bestTimeHard !== null) && (
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShareStreak}
                            accessibilityLabel="Share My Streak"
                        >
                            <Image
                                source={require('../../../assets/images/icons/icon_share.png')} // Adjust path
                                style={styles.shareIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.profileImageContainer}>
                    <View style={styles.defaultProfileImage}>
                        <Text style={styles.defaultProfileText}>
                            {username.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardsWrapper}>
                    <Animated.View style={[styles.card, animatedCard1Style]}>
                        <Text style={styles.cardIcon}>⏱️</Text>
                        <Text style={styles.cardValue}>{displayBestTime}</Text>
                        <Text style={styles.cardLabel}>ምርጥ ሰዓት{'\n'}(ከባድ)</Text>
                        {bestTimeHard !== null && guessesInBestTimeHardGame !== null && (
                            <Text style={styles.cardSubLabel}>({guessesInBestTimeHardGame} ግምት)</Text>
                        )}
                    </Animated.View>

                    <Animated.View style={[styles.card, animatedCard2Style]}>
                        <Text style={styles.cardIcon}>🔥</Text>
                        <Text style={styles.cardValue}>{currentStreak}</Text>
                        <Text style={styles.cardLabel}>የአሁኑ ጉዞ{'\n'}(ቀናት)</Text>
                    </Animated.View>

                    <Animated.View style={[styles.card, animatedCard3Style]}>
                        <Text style={styles.cardIcon}>🏆</Text>
                        <Text style={styles.cardValue}>{maxStreak}</Text>
                        <Text style={styles.cardLabel}>ከፍተኛው ጉዞ{'\n'}(ቀናት)</Text>
                    </Animated.View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (context) {
                            context.dispatch({ type: 'CLOSE_MODAL' });
                        }
                         // navigation.goBack();
                    }}
                    accessibilityLabel="ዝጋ"
                >
                    <Image
                        source={require('../../../assets/images/icons/icon_home.png')} // Adjust path
                        style={styles.footerIcon}
                    />
                    <Text style={styles.footerButtonText}>ዝጋ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default StreakModal;
