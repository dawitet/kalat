// src/screens/WipScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '../providers/ThemeProvider';

interface WipScreenProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

const WipScreen: React.FC<WipScreenProps> = ({
  title = 'በቅርብ ቀን',
  message = 'ይህ ገጽ በግንባታ ላይ ነው። እባክዎ በቅርቡ ተመልሰው ይምጡ!',
  onBack,
}) => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.primary,
    },
    icon: {
      width: 80,
      height: 80,
      marginBottom: 25,
      tintColor: theme.colors.accent,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22,
    },
    backButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginTop: 20,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.buttonText,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icons/adey.png')}
        style={styles.icon}
      />
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.messageText}>{message}</Text>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>ተመለስ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WipScreen;
