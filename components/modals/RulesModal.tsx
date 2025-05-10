// src/mobile/components/modals/RulesModal.tsx OR src/screens/RulesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Context Hook
import { useGameContext } from '../../context/hook'; // Adjust path
import { useTheme } from '../../providers/ThemeProvider'; // Adjust path

const RulesModal: React.FC = () => {
    const { dispatch } = useGameContext();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    // Dynamic styles based on theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
        },
        section: {
            marginBottom: 20,
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors.text,
            marginBottom: 16,
            textAlign: Platform.OS === 'ios' ? 'justify' : 'left',
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 20,
        },
        heading: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        exampleContainer: {
            marginBottom: 24,
            alignItems: 'flex-start',
        },
        exampleRow: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        exampleTile: {
            width: 44, // Slightly larger for better visibility
            height: 44,
            borderWidth: 1,
            borderRadius: 4,
            marginHorizontal: 3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.tile.background, // Use theme
            borderColor: theme.colors.tile.borderEmpty,    // Use theme
        },
        exampleTileCorrect: {
            backgroundColor: theme.colors.tile.correct,
            borderColor: theme.colors.tile.correct,
        },
        exampleTilePresent: {
            backgroundColor: theme.colors.tile.present,
            borderColor: theme.colors.tile.present,
        },
        exampleTileAbsent: {
            backgroundColor: theme.colors.tile.absent,
            borderColor: theme.colors.tile.absent,
        },
        exampleTileText: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.tile.text, // Base text color for tiles
        },
        exampleTileFeedbackText: { // For correct, present, absent
             color: theme.colors.tile.feedbackText,
        },
        exampleDescription: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.colors.text,
            marginTop: 8,
        },
        strong: {
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        strongCorrect: {
            color: theme.colors.tile.correct,
        },
        strongPresent: {
            color: theme.colors.tile.present,
        },
        strongAbsent: {
            color: theme.colors.tile.absent, // Or a slightly darker theme.colors.text
        },
        difficultyList: {
            // marginLeft: 10, // Indent if needed
        },
        difficultyItem: {
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors.text,
            marginBottom: 10,
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
    });

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.paragraph}>
                          ግብዎ አራት ፊደል ያለውን የተደበቀ ቃል በሶስት ወይም ከዚያ ባነሰ ሙከራ መገመት ነው።
                    </Text>
                    <Text style={styles.paragraph}>
                        እያንዳንዱ ግምት ትክክለኛ አራት ፊደል ያለው የአማርኛ ቃል መሆን አለበት። ለመገመት "ገምት" የሚለውን ቁልፍ ይጫኑ።
                    </Text>
                    <Text style={styles.paragraph}>
                        ከእያንዳንዱ ግምት በኋላ፣ የሳጥኖቹ ቀለሞች ግምቱ ወደ ቃሉ ምን ያህል እንደቀረበ ለማሳየት ይለወጣሉ።
                    </Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.heading}>ምሳሌዎች</Text>

                <View style={styles.exampleContainer}>
                    <View style={styles.exampleRow}>
                        <View style={[styles.exampleTile, styles.exampleTileCorrect]}><Text style={[styles.exampleTileText, styles.exampleTileFeedbackText]}>ሰ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ላ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ም</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>_</Text></View>
                    </View>
                    <Text style={styles.exampleDescription}>
                        <Text style={[styles.strong, styles.strongCorrect]}>አረንጓዴ፡</Text> ፊደሉ 'ሰ' በቃሉ ውስጥ እና በትክክለኛው ቦታ ላይ ነው።
                    </Text>
                </View>

                <View style={styles.exampleContainer}>
                    <View style={styles.exampleRow}>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ደ</Text></View>
                        <View style={[styles.exampleTile, styles.exampleTilePresent]}><Text style={[styles.exampleTileText, styles.exampleTileFeedbackText]}>ብ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ዳ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ቤ</Text></View>
                    </View>
                    <Text style={styles.exampleDescription}>
                        <Text style={[styles.strong, styles.strongPresent]}>ቢጫ፡</Text> ፊደሉ 'ብ' በቃሉ ውስጥ አለ፣ ነገር ግን በተሳሳተ ቦታ ላይ ነው።
                    </Text>
                </View>

                <View style={styles.exampleContainer}>
                    <View style={styles.exampleRow}>
                        <View style={[styles.exampleTile, styles.exampleTileAbsent]}><Text style={[styles.exampleTileText, styles.exampleTileFeedbackText]}>ቅ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ር</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>ስ</Text></View>
                        <View style={styles.exampleTile}><Text style={styles.exampleTileText}>_</Text></View>
                    </View>
                    <Text style={styles.exampleDescription}>
                        <Text style={[styles.strong, styles.strongAbsent]}>ግራጫ/ጥቁር፡</Text> ፊደሉ 'ቅ' በቃሉ ውስጥ በየትኛውም ቦታ ላይ የለም።
                    </Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.heading}>የደረጃ ልዩነቶች</Text>
                <View style={styles.difficultyList}>
                    <Text style={styles.difficultyItem}>
                        <Text style={styles.strong}>ቀላል፡</Text> ቃሉ ቢያንስ 3 'አባት' ፊደላት (ሀ፣ ለ፣ መ...) ይኖረዋል።
                    </Text>
                    <Text style={styles.difficultyItem}>
                        <Text style={styles.strong}>ከባድ፡</Text> ቃሉ 2 ወይም ከዚያ በታች 'አባት' ፊደላት ሊኖረው ይችላል።
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        dispatch({ type: 'CLOSE_MODAL' });
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

export default RulesModal;
