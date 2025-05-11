// assets/imageRegistry.ts
import { Platform } from 'react-native';

// Handle image imports differently based on platform
// Specifically to address "Property 'require' doesn't exist" error with Hermes
// Using a more specific type for image assets
const imageAssets: Record<string, ReturnType<typeof require>> = {
  // Main images
  'adey': require('./images/adey.png'),
  'dave': require('./images/dave.png'),
  'dog': require('./images/dog.png'),
  // Icons
  'adey_icon': require('./images/icons/adey.png'),
  'icon_home': require('./images/icons/icon_home.png'),
  'icon_feedback': require('./images/icons/icon_feedback.png'),
  // SVG files
  'kalat_logo_svg': require('./images/ቃላት.svg'),
};

export const getImageSource = (name: string) => {
  if (Platform.OS === 'web') {
    // For web, return the URI directly
    return {uri: name};
  }
  // For native platforms, return the required module
  return imageAssets[name] || null;
};

// For backwards compatibility, maintain the registerImages function
export const registerImages = () => {
  // This function now exists just for backward compatibility
  // The actual registration happens when the module is imported
  return imageAssets;
};
