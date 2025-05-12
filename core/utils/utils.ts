// src/utils.ts

import {Dimensions, Platform} from 'react-native';
import {TileState} from '../../types'; // Assuming TileState is in types.ts

// Keyboard layouts for Amharic
export const amharicKeyboardLayout = [
  ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', 'ሏ'],
  ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ', 'ሟ'],
  ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ', '᎙'], // Placeholder for ሟ, ሯ, ሷ etc. if not directly on keyboard
  ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ', 'ሸ'],
  ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ', 'ⶓ'],
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
  ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ', 'ደ'], // Note: ደ is out of typical order, consider placement
  ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ', 'ጓ'],
  ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ', 'ጧ'],
  ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ', 'ጯ'],
  ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ', 'ጷ'],
  ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ', 'ጿ'],
  ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ', 'ፈ'], // Note: ፈ is out of typical order
  ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ', 'ፏ'],
  ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ', 'ፗ'],
  ['BACKSPACE', 'ENTER'],
];

// Feedback generation logic (simplified example)
export const getFeedback = (guess: string, targetWord: string): TileState[] => {
  const feedback: TileState[] = Array(targetWord.length).fill('absent');
  const targetArray = targetWord.split('');
  const guessArray = guess.split('');

  // Mark correct letters (green)
  for (let i = 0; i < targetWord.length; i++) {
    if (guessArray[i] === targetArray[i]) {
      feedback[i] = 'correct';
      targetArray[i] = '#'; // Mark as used to prevent re-matching for present
      guessArray[i] = '$'; // Mark as processed
    }
  }

  // Mark present letters (yellow)
  for (let i = 0; i < targetWord.length; i++) {
    if (guessArray[i] !== '$') {
      // If not already marked correct
      const letterIndexInTarget = targetArray.indexOf(guessArray[i]);
      if (letterIndexInTarget !== -1) {
        feedback[i] = 'present';
        targetArray[letterIndexInTarget] = '#'; // Mark as used
      } // No explicit else for 'absent' as it's the default
    }
  }
  return feedback;
};

// Check if the device is a tablet
export const isTablet = (): boolean => {
  const {width, height} = Dimensions.get('window');
  const aspectRatio = width / height;
  // These thresholds might need adjustment based on testing across various devices
  if (Platform.OS === 'ios') {
    // iPad mini, Air, Pro all have aspect ratios around 0.75
    // iPhones are typically narrower (e.g., 0.46 for iPhone 12 Pro Max)
    return aspectRatio > 0.6 && aspectRatio < 0.8; // Example range for iPads
  } else {
    // Android tablets vary widely. A common heuristic is diagonal screen size or DPI,
    // but aspect ratio can also be an indicator.
    // This is a very rough heuristic and might not be reliable for all Android tablets.
    return aspectRatio > 0.6 && aspectRatio < 1.0; // Wider range for Android tablets
  }
};

// Generate a simple unique ID (for keys, etc.)
let idCounter = 0;
export const uniqueId = (prefix = 'id'): string => {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
};

// Debounce function to limit the rate at which a function can fire.
export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function to ensure a function is not called more than once in a given period.
export const throttle = <F extends (...args: unknown[]) => unknown>(
  func: F,
  limit: number,
): ((...args: Parameters<F>) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return (...args: Parameters<F>): void => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(() => {
        if (Date.now() - (lastRan || 0) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan || 0)));
    }
  };
};
