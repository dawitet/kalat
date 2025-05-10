// src/screens/MainMenu.tsx
import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useTheme } from '../providers/ThemeProvider';
import { Difficulty } from '../types';

const MainMenu: React.FC = () => {
    const context = useContext(GameContext);
    const { theme } = useTheme();

    useEffect(() => {
        // Example: Fetch dynamic data or check for updates if needed when menu loads
    }, []);

    if (!context) {
        return <Text>Loading context...</Text>;
    }

    const { gameState, dispatch } = context;

    const handleNavigation = (screen: string, params?: any) => {
        console.log(`Navigating to ${screen} with params:`, params);
        if (screen === 'GameView') {
            if (params.difficulty) {
                dispatch({ type: 'SET_CURRENT_DIFFICULTY' as any, payload: params.difficulty });
                dispatch({ type: 'NAVIGATE_TO_GAME' as any });
            }
        } else if (screen === 'Settings') {
            dispatch({ type: 'SET_ACTIVE_MODAL' as any, payload: 'Settings' });
        } else if (screen === 'Rules') {
            dispatch({ type: 'SET_ACTIVE_MODAL' as any, payload: 'Rules' });
        } else if (screen === 'Credits') {
            dispatch({ type: 'SET_ACTIVE_MODAL' as any, payload: 'Credits' });
        } else if (screen === 'Streak') {
            dispatch({ type: 'SET_ACTIVE_MODAL' as any, payload: 'Streak' });
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
        scrollViewContent: {
            paddingTop: Platform.OS === 'ios' ? 40 : 20,
            paddingBottom: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        logoContainer: {
            marginBottom: 30,
            alignItems: 'center',
        },
        logo: {
            width: 120,
            height: 120,
            resizeMode: 'contain',
        },
        logoText: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginTop: 10,
        },
        buttonGrid: {
            width: '100%',
            maxWidth: 500,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        menuButton: {
            backgroundColor: theme.colors.secondary,
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginHorizontal: 7.5,
            minHeight: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        fullWidthButton: {
            marginHorizontal: 0,
        },
        buttonIconContainer: {
            marginBottom: 8,
        },
        buttonIcon: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
            tintColor: theme.colors.accent,
        },
        buttonText: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: '600',
            textAlign: 'center',
        },
        newBadge: {
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'orange',
            borderRadius: 5,
            paddingHorizontal: 4,
            paddingVertical: 1,
        },
        newBadgeText: {
            color: 'white',
            fontSize: 8,
        },
        fullWidthButtonContainer: {
            width: '100%',
        },
    });

    const menuItems = [
        {
            title: 'ዕለታዊ ጨዋታ',
            icon: require('../../assets/images/icons/check.png'),
            action: () => handleNavigation('GameView', { difficulty: 'hard' as Difficulty }),
            isFullWidth: true,
            badge: gameState.dailyStatus && (!gameState.dailyStatus.hardCompleted || !gameState.dailyStatus.easyCompleted) ? 'New' : null,
        },
        {
            title: 'ልምምድ',
            icon: require('../../assets/images/icons/adey.png'),
            action: () => handleNavigation('GameView', { difficulty: 'easy' as Difficulty }),
        },
        {
            title: 'የእኔ ጉዞ',
            icon: require('../../assets/images/icons/dave.png'),
            action: () => handleNavigation('Streak'),
        },
        {
            title: 'ደንቦች',
            icon: require('../../assets/images/icons/c.png'),
            action: () => handleNavigation('Rules'),
        },
        {
            title: 'ስለ መተግበሪያው',
            icon: require('../../assets/images/icons/a.png'),
            action: () => handleNavigation('Credits'),
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/ቃላት.svg')} style={styles.logo} />
                <Text style={styles.logoText}>ቃላት</Text>
            </View>

            <View style={styles.buttonGrid}>
                {menuItems.map((item, index) => {
                    if (item.isFullWidth) {
                        return (
                            <View key={index} style={[styles.buttonRow, styles.fullWidthButtonContainer]}>
                                <TouchableOpacity style={[styles.menuButton, styles.fullWidthButton]} onPress={item.action}>
                                    {item.icon && (
                                        <View style={styles.buttonIconContainer}>
                                            <Image source={item.icon} style={styles.buttonIcon} />
                                        </View>
                                    )}
                                    <Text style={styles.buttonText}>{item.title}</Text>
                                    {item.badge && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newBadgeText}>{item.badge}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    if (index % 2 === (menuItems.find(i => i.isFullWidth) ? 1 : 0)) {
                        const nextItem = menuItems[index + 1];
                        return (
                            <View key={index} style={styles.buttonRow}>
                                <TouchableOpacity style={styles.menuButton} onPress={item.action}>
                                    {item.icon && (
                                        <View style={styles.buttonIconContainer}>
                                            <Image source={item.icon} style={styles.buttonIcon} />
                                        </View>
                                    )}
                                    <Text style={styles.buttonText}>{item.title}</Text>
                                </TouchableOpacity>
                                {nextItem && !nextItem.isFullWidth ? (
                                    <TouchableOpacity style={styles.menuButton} onPress={nextItem.action}>
                                        {nextItem.icon && (
                                            <View style={styles.buttonIconContainer}>
                                                <Image source={nextItem.icon} style={styles.buttonIcon} />
                                            </View>
                                        )}
                                        <Text style={styles.buttonText}>{nextItem.title}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.menuButton} />
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        </ScrollView>
    );
};

export default MainMenu;
