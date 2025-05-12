// src/components/modals/RulesModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Context Hook & Components
import {useGameContext} from '../../context/hook';
import {useTheme} from '../../providers/ThemeProvider';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {getImageSource} from '../../assets/imageRegistry';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({visible, onClose}) => {
  const {setActiveModal} = useGameContext();
  const {theme} = useTheme();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveModal(null);
    onClose();
  };

  // Dynamic styles based on theme
  const styles = StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    modalContentStyle: {
      padding: 0,
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
      width: 44,
      height: 44,
      borderWidth: 1,
      borderRadius: 4,
      marginHorizontal: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.tile.background,
      borderColor: theme.colors.tile.borderEmpty,
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
      color: theme.colors.tile.text,
    },
    exampleTileFeedbackText: {
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
      color: theme.colors.tile.absent,
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
      marginTop: 20,
      alignItems: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      slideAnimation={true}
      contentStyle={styles.modalContentStyle}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            ግብዎ አራት ፊደል ያለውን የተደበቀ ቃል በሶስት ወይም ከዚያ ባነሰ ሙከራ መገመት ነው።
          </Text>
          <Text style={styles.paragraph}>
            ከእያንዳንዱ ግምት በኋላ፣ የሳጥኖቹ ቀለሞች ግምቱ ወደ ቃሉ ምን ያህል እንደቀረበ ለማሳየት ይለወጣሉ።
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.heading}>ምሳሌዎች</Text>

        <View style={styles.exampleContainer}>
          <View style={styles.exampleRow}>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>መ</Text>
            </View>
            <View style={[styles.exampleTile, styles.exampleTileCorrect]}>
              <Text
                style={[
                  styles.exampleTileText,
                  styles.exampleTileFeedbackText,
                ]}>
                ሰ
              </Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ላ</Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ም</Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>_</Text>
            </View>
          </View>
          <Text style={styles.exampleDescription}>
            <Text style={[styles.strong, styles.strongCorrect]}>አረንጓዴ፡</Text>{' '}
            ፊደሉ 'ሰ' በቃሉ ውስጥ እና በትክክለኛው ቦታ ላይ ነው።
          </Text>
        </View>

        <View style={styles.exampleContainer}>
          <View style={styles.exampleRow}>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ደ</Text>
            </View>
            <View style={[styles.exampleTile, styles.exampleTilePresent]}>
              <Text
                style={[
                  styles.exampleTileText,
                  styles.exampleTileFeedbackText,
                ]}>
                ብ
              </Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ዳ</Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ቤ</Text>
            </View>
          </View>
          <Text style={styles.exampleDescription}>
            <Text style={[styles.strong, styles.strongPresent]}>ቢጫ፡</Text> ፊደሉ
            'ብ' በቃሉ ውስጥ አለ፣ ነገር ግን በተሳሳተ ቦታ ላይ ነው።
          </Text>
        </View>

        <View style={styles.exampleContainer}>
          <View style={styles.exampleRow}>
            <View style={[styles.exampleTile, styles.exampleTileAbsent]}>
              <Text
                style={[
                  styles.exampleTileText,
                  styles.exampleTileFeedbackText,
                ]}>
                ቅ
              </Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ር</Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>ስ</Text>
            </View>
            <View style={styles.exampleTile}>
              <Text style={styles.exampleTileText}>_</Text>
            </View>
          </View>
          <Text style={styles.exampleDescription}>
            <Text style={[styles.strong, styles.strongAbsent]}>ግራጫ/ጥቁር፡</Text>{' '}
            ፊደሉ 'ቅ' በቃሉ ውስጥ በየትኛውም ቦታ ላይ የለም።
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.heading}>የደረጃ ልዩነቶች</Text>
        <View style={styles.difficultyList}>
          <Text style={styles.difficultyItem}>
            <Text style={styles.strong}>ቀላል፡</Text> ቃሉ ቢያንስ 3 'አባት' ፊደላት (ሀ፣ ለ፣
            መ...) ይኖረዋል።
          </Text>
          <Text style={styles.difficultyItem}>
            <Text style={styles.strong}>ከባድ፡</Text> ቃሉ 2 ወይም ከዚያ በታች 'አባት' ፊደላት
            ሊኖረው ይችላል።
          </Text>
          <Button
            label="ዝጋ"
            onPress={handleClose}
            leftIcon={<Image source={getImageSource('icon_home') || undefined} />}
            variant="primary"
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

export default React.memo(RulesModal);
