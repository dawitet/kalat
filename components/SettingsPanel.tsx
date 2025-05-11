// src/screens/SettingsPanel.tsx
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {useTheme} from '../providers/ThemeProvider';
import {GameContext} from '../context/GameContext';
import {ThemePreference} from '../types';

const SettingsPanel: React.FC = () => {
  const context = useContext(GameContext);
  const {theme, isDark, toggleTheme} = useTheme();

  if (!context) {
    return <Text>Loading settings...</Text>;
  }
  const {gameState, dispatch} = context;

  const handleThemeChange = (value: ThemePreference) => {
    if (toggleTheme) {
      toggleTheme();
    }
    dispatch({
      type: 'UPDATE_PREFERENCE' as any,
      payload: {key: 'themePreference', value: value},
    });
  };

  const handleHintsToggle = (value: boolean) => {
    dispatch({
      type: 'UPDATE_PREFERENCE' as any,
      payload: {key: 'hintsEnabled', value: value},
    });
  };

  const handleSoundToggle = (value: boolean) => {
    dispatch({
      type: 'UPDATE_PREFERENCE' as any,
      payload: {key: 'isMuted', value: value},
    });
  };

  const handleDailyReminderToggle = (value: boolean) => {
    dispatch({
      type: 'UPDATE_PREFERENCE' as any,
      payload: {key: 'dailyReminderEnabled', value: value},
    });
    if (Platform.OS !== 'web') {
      if (value) {
        // Schedule notifications
      } else {
        // Cancel notifications
      }
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'እድገት ዳግም ያስጀምሩ?',
      'እርግጠኛ ነዎት ሁሉንም የእድገት እና የስታቲስቲክስ መረጃዎን ዳግም ማስጀመር ይፈልጋሉ? ይህ እርምጃ ሊቀለበስ አይችልም።',
      [
        {
          text: 'ይቅር',
          style: 'cancel',
        },
        {
          text: 'ዳግም ያስጀምሩ',
          onPress: () => dispatch({type: 'RESET_ALL_DATA' as any}),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    scrollView: {
      flexGrow: 1,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    section: {
      marginTop: 20,
      marginHorizontal: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastSection: {
      borderBottomWidth: 0,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 15,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    rowLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    themeButtonsContainer: {
      flexDirection: 'row',
    },
    themeButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginHorizontal: 5,
    },
    selectedThemeButton: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    themeButtonText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedThemeButtonText: {
      color: theme.colors.buttonText,
    },
    linkText: {
      fontSize: 16,
      color: theme.colors.link,
      textDecorationLine: 'underline',
    },
    resetButton: {
      backgroundColor: theme.colors.destructive,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    resetButtonText: {
      fontSize: 16,
      color: theme.colors.destructive,
      fontWeight: '600',
    },
    disabledRow: {
      opacity: 0.5,
    },
  });

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ገጽታ</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>ገጽታ ምርጫ</Text>
          <View style={styles.themeButtonsContainer}>
            {(['light', 'dark', 'system'] as ThemePreference[]).map(pref => (
              <TouchableOpacity
                key={pref}
                style={[
                  styles.themeButton,
                  gameState.themePreference === pref &&
                    styles.selectedThemeButton,
                ]}
                onPress={() => handleThemeChange(pref)}>
                <Text
                  style={[
                    styles.themeButtonText,
                    gameState.themePreference === pref &&
                      styles.selectedThemeButtonText,
                  ]}>
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>የጨዋታ ቅንብሮች</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>ፍንጮችን አንቃ</Text>
          <Switch
            trackColor={{false: theme.colors.border, true: theme.colors.accent}}
            thumbColor={isDark ? theme.colors.primary : theme.colors.primary}
            ios_backgroundColor={theme.colors.border}
            onValueChange={handleHintsToggle}
            value={gameState.hintsEnabled}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>ድምፅን ድምጸ-ከል አድርግ</Text>
          <Switch
            trackColor={{false: theme.colors.border, true: theme.colors.accent}}
            thumbColor={isDark ? theme.colors.primary : theme.colors.primary}
            ios_backgroundColor={theme.colors.border}
            onValueChange={handleSoundToggle}
            value={gameState.isMuted}
          />
        </View>
        {Platform.OS !== 'web' && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>ዕለታዊ አስታዋሽ</Text>
            <Switch
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={isDark ? theme.colors.primary : theme.colors.primary}
              ios_backgroundColor={theme.colors.border}
              onValueChange={handleDailyReminderToggle}
              value={gameState.dailyReminderEnabled}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ዳታ አስተዳደር</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetProgress}>
          <Text style={styles.resetButtonText}>ሁሉንም እድገት ዳግም ያስጀምሩ</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>ተጨማሪ</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => openLink('https://your-privacy-policy-url.com')}>
          <Text style={styles.linkText}>የግላዊነት መመሪያ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.row, styles.disabledRow]}
          onPress={() => openLink('https://your-terms-of-service-url.com')}
          disabled={true}>
          <Text style={styles.linkText}>የአገልግሎት ውል (በቅርብ ቀን)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsPanel;
