// src/components/modals/StreakModal.tsx
import React, {useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  Image,
} from 'react-native';
import {getImageSource} from '../../assets/imageRegistry';
import * as Haptics from 'expo-haptics';
import {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

// Components and hooks
import {useGameContext} from '../../context/hook';
import {useTheme} from '../../providers/ThemeProvider';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatCard from './StatCard';
import { style } from 'framer-motion/client';

interface StreakModalProps {
  visible: boolean;
  onClose: () => void;
}

const StreakModal: React.FC<StreakModalProps> = ({visible, onClose}) => {
  const {gameState, setActiveModal} = useGameContext();
  const {theme} = useTheme();

  // Animation values for each card
  const card1Anim = useSharedValue(0);
  const card2Anim = useSharedValue(0);
  const card3Anim = useSharedValue(0);

  // Initialize animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      const springConfig = { damping: 12, stiffness: 100, mass: 0.8 };
      card1Anim.value = withDelay(50, withSpring(1, springConfig));
      card2Anim.value = withDelay(150, withSpring(1, springConfig));
      card3Anim.value = withDelay(250, withSpring(1, springConfig));
    } else {
      card1Anim.value = 0;
      card2Anim.value = 0;
      card3Anim.value = 0;
    }
  }, [visible, card1Anim, card2Anim, card3Anim]);

  // Animated styles for cards (useAnimatedStyle must be top-level)
  const animatedCard1Style = useAnimatedStyle(() => ({
    opacity: card1Anim.value,
    transform: [
      { scale: interpolate(card1Anim.value, [0,1], [0.8,1], Extrapolate.CLAMP) },
      { translateY: interpolate(card1Anim.value, [0,1], [20,0], Extrapolate.CLAMP) },
    ],
  }));

  const animatedCard2Style = useAnimatedStyle(() => ({
    opacity: card2Anim.value,
    transform: [
      { scale: interpolate(card2Anim.value, [0,1], [0.8,1], Extrapolate.CLAMP) },
      { translateY: interpolate(card2Anim.value, [0,1], [20,0], Extrapolate.CLAMP) },
    ],
  }));

  const animatedCard3Style = useAnimatedStyle(() => ({
    opacity: card3Anim.value,
    transform: [
      { scale: interpolate(card3Anim.value, [0,1], [0.8,1], Extrapolate.CLAMP) },
      { translateY: interpolate(card3Anim.value, [0,1], [20,0], Extrapolate.CLAMP) },
    ],
  }));

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveModal(null);
    onClose();
  }, [setActiveModal, onClose]);

  const {
    userId,
    currentStreak = 0,
    maxStreak = 0,
    bestTimeHard = null,
    guessesInBestTimeHardGame = null,
  } = gameState || {};

  const handleShareStreak = useCallback(async () => {
    if (currentStreak === 0 && maxStreak === 0 && bestTimeHard === null) {
      // Use impactAsync instead of notificationAsync which might not be supported
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
    } catch (error: Error | unknown) {
      console.error('Error sharing streak:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('ስህተት', 'ጉዞውን ማጋራት አልተቻለም: ' + errorMessage);
    }
  }, [currentStreak, maxStreak, bestTimeHard]);

  const styles = useMemo(() => StyleSheet.create({
    scrollContent: { padding: 20, paddingBottom: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', minHeight: 40 },
    profileName: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, textAlign: 'center' },
    profileImageContainer: { alignItems: 'center', marginBottom: 25 },
    defaultProfileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center' },
    defaultProfileText: { fontSize: 32, color: theme.colors.text },
    cardsWrapper: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    buttonSpacing: { marginTop: 10 },
    shareIcon: { width: 24, height: 24 },
    homeIcon: { width: 24, height: 24 },
    // added modalContent style
    modalContent: { padding: 0 },
    errorPlaceholder: { padding: 20, alignItems: 'center', justifyContent: 'center' },
    errorText: { fontSize: 16, color: theme.colors.text },
  }), [theme]);

  // Format time helper
  const formatTime = useCallback(
    (timeInSeconds: number | null | undefined): string => {
      if (typeof timeInSeconds !== 'number' || timeInSeconds < 0) {
        return 'N/A';
      }
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    },
    [],
  );

  const displayBestTime = formatTime(bestTimeHard);

  // Error state - user not found
  if (!userId) {
    return (
      <Modal visible={visible} onClose={onClose}>
        <View style={styles.errorPlaceholder}>
          <Text style={styles.errorText}>
            የተጠቃሚ መረጃን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።
          </Text>
        </View>
      </Modal>
    );
  }

  // Derive username from userId or use a default
  const username = userId ? `ተጫዋች ${userId.substring(0, 5)}` : 'ገማች';

  return (
    <Modal visible={visible} onClose={handleClose} contentStyle={styles.modalContent}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.profileName}>{username}</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <View style={styles.defaultProfileImage}>
            <Text style={styles.defaultProfileText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardsWrapper}>
          <StatCard
            icon="⏱️"
            value={displayBestTime}
            label={'ምርጥ ሰዓት\n(ከባድ)'}
            subLabel={
              bestTimeHard !== null && guessesInBestTimeHardGame !== null
                ? `(${guessesInBestTimeHardGame} ግምት)`
                : undefined
            }
            animatedStyle={animatedCard1Style}
          />

          <StatCard
            icon="🔥"
            value={currentStreak.toString()}
            label={'የአሁኑ ጉዞ\n(ቀናት)'}
            animatedStyle={animatedCard2Style}
          />

          <StatCard
            icon="🏆"
            value={maxStreak.toString()}
            label={'ከፍተኛው ጉዞ\n(ቀናት)'}
            animatedStyle={animatedCard3Style}
          />
        </View>

          <Button
            label="ማጋራት"
            onPress={handleShareStreak}
            leftIcon={<Image source={getImageSource('icon_share') || undefined} style={styles.shareIcon} />}
            variant="secondary"
            disabled={
              currentStreak === 0 && maxStreak === 0 && bestTimeHard === null
            }
            style={styles.buttonSpacing}
          />

          <Button
            label="ዝጋ"
            onPress={handleClose}
            leftIcon={<Image source={getImageSource('icon_home') || undefined} style={styles.homeIcon} />}
            variant="primary"
          />
      </ScrollView>
    </Modal>
  );
};

export default React.memo(StreakModal);
