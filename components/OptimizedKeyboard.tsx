// src/components/OptimizedKeyboard.tsx
import React, {memo, useMemo} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import OptimizedKey from './OptimizedKey';
import {TileState} from '../types';

export interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterHints: {[key: string]: TileState};
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

// Amharic keyboard layout - extracted outside component for memory efficiency
const amharicKeyboardLayout = [
  ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', 'ሏ'],
  ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ', 'ሟ'],
  ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ', 'ሷ', 'ሿ', 'ሯ', 'ሷ'],
  ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ', 'ሸ'],
  ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ', 'ቋ'],
  ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ', 'ቧ'],
  ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ', 'ቷ'],
  ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ', 'ቿ'],
  ['ኀ', 'ኁ', 'ኂ', 'ኃ', 'ኄ', 'ኅ', 'ኆ', 'ኋ'],
  ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ', 'ኗ'],
  ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ', 'ኟ'],
  ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ', 'ኧ'],
  ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ', 'ኳ'],
  ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ', 'ዃ'],
  ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ', 'ዟ'],
  ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ', 'ዠ'],
  ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ', 'ዢ'],
  ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ', 'ደ'],
  ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ', 'ጓ'],
  ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ', 'ጧ'],
  ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ', 'ጯ'],
  ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ', 'ጷ'],
  ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ', 'ጿ'],
  ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ', 'ፈ'],
  ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ', 'ፏ'],
  ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ', 'ፗ'],
  ['BACKSPACE', 'ENTER'],
];

// Fixed styles for the keyboard
const styles = StyleSheet.create({
  keyboardContainer: {
    alignSelf: 'stretch',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
});

/**
 * Optimized Keyboard component with memoization for better performance
 */
const OptimizedKeyboard: React.FC<KeyboardProps> = memo(
  ({onKeyPress, letterHints, style, disabled = false}) => {
    // Memoize keyboard rows to prevent unnecessary re-renders
    const keyboardRows = useMemo(() => {
      return amharicKeyboardLayout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((keyVal, keyIndex) => (
            <OptimizedKey
              key={`key-${rowIndex}-${keyVal}-${keyIndex}`}
              value={keyVal}
              onClick={onKeyPress}
              state={letterHints[keyVal]}
              isFunctionKey={keyVal === 'ENTER' || keyVal === 'BACKSPACE'}
              isDisabled={disabled}
            />
          ))}
        </View>
      ));
    }, [onKeyPress, letterHints, disabled]);

    return (
      <View style={[styles.keyboardContainer, style]} testID="keyboard">
        {keyboardRows}
      </View>
    );
  },
);

export default OptimizedKeyboard;
