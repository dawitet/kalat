// src/mobile/components/modals/CreditsModal.tsx OR src/screens/CreditsScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Config Import
import { FEEDBACK_TARGET_USERNAME } from '../../config'; // Adjust path if needed

// Context Hook
import { GameContext } from '../../context/GameContext'; // Adjust path
import { useTheme } from '../../providers/ThemeProvider'; // Adjust path to your ThemeProvider's useTheme

const CreditsModal: React.FC = () => { // Changed to be a screen/full modal
    const context = useContext(GameContext);
    const insets = useSafeAreaInsets();
    const { theme } = useTheme(); // Assuming useTheme provides ThemeColors

    // Content Variables
    const creatorName = 'Dawit Sahle';
    const studioName = 'Buchi Studio';
    const currentYear = new Date().getFullYear();
    const feedbackUsername = FEEDBACK_TARGET_USERNAME;
    const feedbackLink = `https://t.me/${feedbackUsername}`;

    const handleFeedbackLink = async () => {
        try {
            const supported = await Linking.canOpenURL(feedbackLink);
            if (supported) {
                await Linking.openURL(feedbackLink);
            } else {
                Alert.alert('ስህተት', `ቴሌግራምን መክፈት አልተቻለም። በ ${feedbackLink} ያግኙን።`);
            }
        } catch (error) {
            console.error('Error opening feedback link:', error);
            Alert.alert('ስህተት', 'አገናኙን መክፈት አልተቻለም።');
        }
    };

    const handleBackToMenu = () => {
        if (!context) {
            console.error('GameContext is not available in CreditsModal');
            return; // Or throw new Error('GameContext not available');
        }
        context.dispatch({ type: 'GO_HOME' });
    };

    // Dynamic styles based on theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary, // Use theme
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20, // Padding for content before footer
        },
        section: {
            marginBottom: 25,
        },
        centeredSection: {
            alignItems: 'center',
            marginBottom: 25,
        },
        logo: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 15,
            borderWidth: 3,
            borderColor: theme.colors.border, // Use theme accent
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text, // Use theme
            marginBottom: 10,
            textAlign: 'center',
        },
        headerTitle: { // For the modal header, if applicable
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.hint, // Use theme
            marginBottom: 8,
            textAlign: 'center',
        },
        copyright: {
            fontSize: 14,
            color: theme.colors.hint, // Use theme
            textAlign: 'center',
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border, // Use theme
            marginVertical: 25,
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors.text, // Use theme
            marginBottom: 12,
            textAlign: Platform.OS === 'ios' ? 'justify' : 'left',
        },
        italicText: {
            fontStyle: 'italic',
        },
        link: {
            color: theme.colors.link, // Use theme
            fontWeight: 'bold',
            textDecorationLine: 'underline',
        },
        footer: {
            paddingVertical: 15,
            paddingBottom: insets.bottom + 15, // Adjust for safe area
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.secondary, // Use theme
            alignItems: 'center', // Center the button if it's the only item
        },
        footerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 8,
            backgroundColor: theme.colors.buttonText, // Use theme
        },
        footerIcon: {
            width: 22,
            height: 22,
            marginRight: 10,
            tintColor: theme.colors.buttonText, // Use theme
        },
        footerButtonText: {
            fontSize: 16,
            color: theme.colors.buttonText, // Use theme
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            {/* Optional: Add a header if this is a full screen and not part of a BottomSheet */}
            {/* <Text style={styles.headerTitle}>ስለ መተግበሪያው</Text> */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centeredSection}>
                    <Image
                        source={require('../../../assets/images/dog.png')} // Adjust path
                        style={styles.logo}
                        accessibilityLabel={`${studioName} Logo`}
                    />
                    <Text style={styles.title}>በ{creatorName} የተሰራ</Text>
                    <Text style={styles.copyright}>
                        {studioName} | © {currentYear}
                    </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.section}>
                    <Text style={styles.title}>ተመስጦ</Text>
                    <Text style={styles.paragraph}>
                        ይህ ጨዋታ በታዋቂው የእንቆቅልሽ ጨዋታ <Text style={styles.italicText}>Wordle</Text> እና በሌሎች ተመሳሳይ ቃል-ተኮር ጨዋታዎች ተመስጦ የተሰራ ነው።
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>ቴክኖሎጂ</Text>
                    <Text style={styles.paragraph}>
                        {/* Updated for React Native */}
                        በReact Native፣ TypeScript፣ Expo፣ እና Reanimated የተገነባ።
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>አስተያየት እና ድጋፍ</Text>
                    <Text style={styles.paragraph}>
                        ማንኛውም አይነት አስተያየት፣ የሳንካ ሪፖርቶች ወይም ጥያቄዎች ካሉዎት፣ እባክዎ በቴሌግራም ያግኙን፦{' '}
                        <Text
                            style={styles.link}
                            onPress={handleFeedbackLink}
                        >
                            @{feedbackUsername}
                        </Text>
                    </Text>
                </View>

                <View style={styles.separator} />
                 {/* Add more sections as needed */}

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handleBackToMenu();
                    }}
                    accessibilityLabel="ዝጋ" // Close
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

export default CreditsModal;
