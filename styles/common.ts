// src/styles/common.ts
// This file seems fine as provided. It defines reusable StyleSheet objects.
// You *could* modify it to reference your theme variables if you wanted
// theme-dependent common styles, but as utility classes, they are often generic.

import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import { Theme } from './theme';
// Removed theme imports as the original didn't use them.
// If you want themed common styles, import { spacing, borderRadius, typography } from './theme';

// Common style types - Keep these exportable
export type CommonStyles = {
  container: ViewStyle;
  row: ViewStyle;
  column: ViewStyle;
  center: ViewStyle;
  // Add other common style keys you have defined below
};

// Common styles - Keep as provided or modify as needed
export const commonStyles = StyleSheet.create({
  // Layout & Flexbox
  container: {flex: 1},
  row: {flexDirection: 'row'},
  column: {flexDirection: 'column'},
  center: {justifyContent: 'center', alignItems: 'center'},
  spaceBetween: {justifyContent: 'space-between'},
  spaceAround: {justifyContent: 'space-around'},
  flexStart: {justifyContent: 'flex-start'},
  flexEnd: {justifyContent: 'flex-end'},
  alignStart: {alignItems: 'flex-start'},
  alignEnd: {alignItems: 'flex-end'},
  alignCenter: {alignItems: 'center'},
  alignStretch: {alignItems: 'stretch'}, // Added stretch
  wrap: {flexWrap: 'wrap'},
  nowrap: {flexWrap: 'nowrap'},
  grow: {flexGrow: 1},
  shrink: {flexShrink: 1},
  basisAuto: {flexBasis: 'auto'}, // Renamed for clarity
  selfStart: {alignSelf: 'flex-start'},
  selfEnd: {alignSelf: 'flex-end'},
  selfCenter: {alignSelf: 'center'},
  selfStretch: {alignSelf: 'stretch'},

  // Text Alignment & Styling
  textCenter: {textAlign: 'center'},
  textLeft: {textAlign: 'left'},
  textRight: {textAlign: 'right'},
  textJustify: {textAlign: 'justify'},
  textAuto: {textAlign: 'auto'},
  textBold: {fontWeight: 'bold'},
  textNormal: {fontWeight: 'normal'}, // Define 'normal' weight explicitly if needed
  textItalic: {fontStyle: 'italic'},
  textUnderline: {textDecorationLine: 'underline'},
  textStrike: {textDecorationLine: 'line-through'},
  textUppercase: {textTransform: 'uppercase'},
  textLowercase: {textTransform: 'lowercase'},
  textCapitalize: {textTransform: 'capitalize'},
  textNone: {textTransform: 'none'},

  // Overflow & Position
  overflowHidden: {overflow: 'hidden'},
  overflowScroll: {overflow: 'scroll'}, // Note: Often handled by ScrollView
  overflowVisible: {overflow: 'visible'},
  positionAbsolute: {position: 'absolute'},
  positionRelative: {position: 'relative'},

  // Z-Index & Elevation (Elevation for Android Shadow)
  zIndex10: {zIndex: 10}, // Example zIndex
  elevation1: {elevation: 1}, // Example elevation
  elevation5: {elevation: 5}, // Example elevation

  // Shadow (iOS)
  shadowSm: {
    // Example small shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  shadowMd: {
    // Example medium shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  // Borders
  border: {borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc'}, // Use hairline width
  borderTop: {borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#ccc'},
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  borderLeft: {borderLeftWidth: StyleSheet.hairlineWidth, borderColor: '#ccc'},
  borderNone: {borderWidth: 0}, // Added for removing borders

  // Border Radius
  roundedSm: {borderRadius: 4}, // Example small radius
  roundedMd: {borderRadius: 8}, // Example medium radius
  roundedLg: {borderRadius: 12}, // Example large radius
  roundedFull: {borderRadius: 9999},
  roundedNone: {borderRadius: 0},
  roundedTopSm: {borderTopLeftRadius: 4, borderTopRightRadius: 4},
  // Add other rounded corners as needed

  // Opacity
  opacity50: {opacity: 0.5}, // Example opacity
  opacity100: {opacity: 1},
  opacity0: {opacity: 0},

  // Background Colors (Generic - Consider using theme colors instead)
  bgTransparent: {backgroundColor: 'transparent'},
  bgWhite: {backgroundColor: '#FFFFFF'},
  bgBlack: {backgroundColor: '#000000'},
  // Add more generic colors if needed, but prefer theme.colors.primary etc.
});

// Utility functions (Keep as is)
export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  styles: T,
): T => {
  return StyleSheet.create(styles);
};

export const combineStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (
    | T
    | false
    | null
    | undefined
    | StyleSheet.NamedStyles<Record<string, unknown>>[string]
  )[] // Allow passing style objects directly
): T[] => {
  // Return array for RN style prop
  return styles.filter(Boolean) as T[];
};

// Helper function to create themed styles (Keep as is)
export const createThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  theme: Theme, // Replaced any with Theme type
  stylesFactory: (theme: Theme) => T, // Use the Theme type here
): T => {
  return StyleSheet.create(stylesFactory(theme));
};
