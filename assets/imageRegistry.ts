import { Platform, ImageSourcePropType } from 'react-native';

// Define image paths for static import
// This avoids the runtime require() function that Hermes is having trouble with

// Create a typed image registry - using native images directly
const imageAssets = {
  // Main images
  adey: require('./images/adey.png'),
  dave: require('./images/dave.png'),
  dog: require('./images/dog.png'),
  
  // Icons
  adey_icon: require('./images/icons/adey.png'),
  icon_home: require('./images/icons/icon_home.png'),
  icon_feedback: require('./images/icons/icon_feedback.png'),
  icon_share: require('./images/icons/icon_share.png'),
  
  // Using PNG instead of SVG to avoid build issues
  kalat_logo_svg: require('./images/adey.png'),
  
  // Additional icons
  icon_about: require('./images/icons/icon_about.png'),
  icon_add_home: require('./images/icons/icon_add_home.png'),
  icon_close: require('./images/icons/icon_close.png'),
  icon_continue: require('./images/icons/icon_continue.png'),
  icon_difficulty_easy: require('./images/icons/icon_difficulty_easy.png'),
  icon_difficulty_hard: require('./images/icons/icon_difficulty_hard.png'),
  icon_feedback_wip: require('./images/icons/icon_feedback_wip.png'),
  icon_friends: require('./images/icons/icon_friends.png'),
  icon_fullscreen_enter: require('./images/icons/icon_fullscreen_enter.png'),
  icon_fullscreen_exit: require('./images/icons/icon_fullscreen_exit.png'),
  icon_hint: require('./images/icons/icon_hint.png'),
  icon_hints_off: require('./images/icons/icon_hints_off.png'),
  icon_hints_on: require('./images/icons/icon_hints_on.png'),
  icon_leaderboard: require('./images/icons/icon_leaderboard.png'),
  icon_mute_off: require('./images/icons/icon_mute_off.png'),
  icon_mute_on: require('./images/icons/icon_mute_on.png'),
  icon_reset: require('./images/icons/icon_reset.png'),
  icon_reset_on: require('./images/icons/icon_reset_on.png'),
  icon_rules: require('./images/icons/icon_rules.png'),
  icon_settings: require('./images/icons/icon_settings.png'),
  icon_start: require('./images/icons/icon_start.png'),
  icon_streak: require('./images/icons/icon_streak.png'),
  icon_theme_dark: require('./images/icons/icon_theme_dark.png'),
  icon_theme_light: require('./images/icons/icon_theme_light.png'),
  icon_theme_system: require('./images/icons/icon_theme_system.png'),
};

// Type the exports
export type ImageKeys = keyof typeof imageAssets;

/**
 * Get an image source by name
 */
export const getImageSource = (name: ImageKeys): ImageSourcePropType => {
  if (Platform.OS === 'web') {
    // For web, return the URI directly
    return { uri: name };
  }
  // For native platforms, return the required module
  return imageAssets[name];
};

/**
 * For backwards compatibility
 */
export const registerImages = () => {
  return imageAssets;
};

// Export the image assets
export default imageAssets;
