// filepath: /Users/dawitsahle/Documents/kalat/assets/imageRegistry.ts
import { Platform, ImageRequireSource } from 'react-native';

// Define a type for our image assets dictionary
type ImageAssets = Record<string, ImageRequireSource>;

// Build the image assets dictionary with direct static requires
// React Native requires static string literals in require statements
const imageAssets: ImageAssets = {
  // Main images
  'adey': require('./images/adey.png'),
  'dave': require('./images/dave.png'),
  'dog': require('./images/dog.png'),

  // Icons
  'adey_icon': require('./images/icons/adey.png'),
  'icon_home': require('./images/icons/icon_home.png'),
  'icon_feedback': require('./images/icons/icon_feedback.png'),
  'icon_share': require('./images/icons/icon_share.png'),

  // SVG files
  'kalat_logo_svg': require('./images/ቃላት.svg'),

  // Additional icons
  'icon_about': require('./images/icons/icon_about.png'),
  'icon_add_home': require('./images/icons/icon_add_home.png'),
  'icon_close': require('./images/icons/icon_close.png'),
  'icon_continue': require('./images/icons/icon_continue.png'),
  'icon_difficulty_easy': require('./images/icons/icon_difficulty_easy.png'),
  'icon_difficulty_hard': require('./images/icons/icon_difficulty_hard.png'),
  'icon_feedback_wip': require('./images/icons/icon_feedback_wip.png'),
  'icon_friends': require('./images/icons/icon_friends.png'),
  'icon_fullscreen_enter': require('./images/icons/icon_fullscreen_enter.png'),
  'icon_fullscreen_exit': require('./images/icons/icon_fullscreen_exit.png'),
  'icon_hint': require('./images/icons/icon_hint.png'),
  'icon_hints_off': require('./images/icons/icon_hints_off.png'),
  'icon_hints_on': require('./images/icons/icon_hints_on.png'),
  'icon_leaderboard': require('./images/icons/icon_leaderboard.png'),
  'icon_mute_off': require('./images/icons/icon_mute_off.png'),
  'icon_mute_on': require('./images/icons/icon_mute_on.png'),
  'icon_reset': require('./images/icons/icon_reset.png'),
  'icon_reset_on': require('./images/icons/icon_reset_on.png'),
  'icon_rules': require('./images/icons/icon_rules.png'),
  'icon_settings': require('./images/icons/icon_settings.png'),
  'icon_start': require('./images/icons/icon_start.png'),
  'icon_streak': require('./images/icons/icon_streak.png'),
  'icon_theme_dark': require('./images/icons/icon_theme_dark.png'),
  'icon_theme_light': require('./images/icons/icon_theme_light.png'),
  'icon_theme_system': require('./images/icons/icon_theme_system.png'),
};

/**
 * Get image source for a given image name
 * @param name Image name key
 * @returns Image source object
 */
export const getImageSource = (name: string): ImageRequireSource | {uri: string} | null => {
  if (Platform.OS === 'web') {
    // For web, return the URI directly
    return {uri: name};
  }

  // For native platforms, return the required module
  return imageAssets[name] || null;
};

/**
 * For backwards compatibility, maintain the registerImages function
 * @returns Image assets dictionary
 */
export const registerImages = (): ImageAssets => {
  // This function now exists just for backward compatibility
  return imageAssets;
};
