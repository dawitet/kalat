// src/components/modals/CreditsModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ImageSourcePropType,
} from 'react-native';
// Use require for native Linking so jest.mock('react-native/Libraries/Linking/Linking') applies
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LinkingNative = require('react-native/Libraries/Linking/Linking') as typeof import('react-native').Linking;
import * as Haptics from 'expo-haptics';
import {getImageSource} from '../../assets/imageRegistry';

// Config Import
import {FEEDBACK_TARGET_USERNAME} from '../../config';

// Custom components
import Modal from '../common/Modal';
import Button from '../common/Button';

// Context Hooks
import {useTheme} from '../../providers/ThemeProvider';
import {useGameContext} from '../../context/hook';

interface CreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({visible, onClose}) => {
  const {theme} = useTheme();
  const {setActiveModal} = useGameContext();

  // Content Variables
  const creatorName = 'Dawit Sahle';
  const studioName = 'Buchi Studio';
  const currentYear = new Date().getFullYear();
  const feedbackUsername = FEEDBACK_TARGET_USERNAME;
  const feedbackLink = `https://t.me/${feedbackUsername}`;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveModal(null);
    onClose();
  };

  const handleFeedbackLink = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const supported = await LinkingNative.canOpenURL(feedbackLink);
      if (supported) {
        await LinkingNative.openURL(feedbackLink);
      } else {
        Alert.alert('ስህተት', `ቴሌግራምን መክፈት አልተቻለም። በ ${feedbackLink} ያግኙን።`);
      }
    } catch (error) {
      console.error('Error opening feedback link:', error);
      Alert.alert('ስህተት', 'አገናኙን መክፈት አልተቻለም።');
    }
  };

  // Dynamic styles based on theme
  const styles = StyleSheet.create({
    creditContent: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    creatorSection: {
      marginTop: 20,
      alignItems: 'center',
    },
    creatorImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    creatorName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    studioName: {
      fontSize: 16,
      color: theme.colors.secondary,
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    feedbackButton: {
      marginTop: 20,
      marginBottom: 10,
    },
    copyright: {
      fontSize: 14,
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    modalContent: {
      maxHeight: '90%',
    },
    feedbackIcon: {
      width: 24,
      height: 24,
    },
    homeIcon: {
      width: 24,
      height: 24,
    },
    footerButton: {
      marginTop: 16,
    },
  });

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      slideAnimation={true}
      contentStyle={styles.modalContent}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.creditContent}>
          <Text style={styles.title}>የቃላት ፈጣሪዎች</Text>

          <View style={styles.creatorSection}>
            <Image
              source={getImageSource('dave') || undefined}
              style={styles.creatorImage}
              resizeMode="cover"
            />
            <Text style={styles.creatorName}>{creatorName}</Text>
            <Text style={styles.studioName}>{studioName}</Text>
          </View>
          <Button
            label="ግብረመልስ ይስጡ"
            variant="primary"
            onPress={handleFeedbackLink}
            leftIcon={getImageSource('icon_feedback') ? <Image source={getImageSource('icon_feedback') as ImageSourcePropType} style={styles.feedbackIcon} /> : undefined}
            style={styles.feedbackButton}
          />

          <Text style={styles.copyright}>
            © {currentYear} {studioName}. መብቱ በሕግ የተጠበቀ ነው።
          </Text>
            leftIcon={getImageSource('icon_home') ? <Image source={getImageSource('icon_home') as ImageSourcePropType} style={styles.homeIcon} /> : null}
          <Button
            label="ዝጋ"
            onPress={handleClose}
            leftIcon={getImageSource('icon_home') ? <Image source={getImageSource('icon_home') as ImageSourcePropType} style={styles.homeIcon} /> : null}
            variant="secondary"
            style={styles.footerButton}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

export default CreditsModal;
