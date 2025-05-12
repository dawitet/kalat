// src/components/common/Container.tsx
import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme} from '../../providers/ThemeProvider';

export interface ContainerProps {
  /**
   * Component children
   */
  children: React.ReactNode;

  /**
   * Custom styles for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether to use padding that respects safe areas
   * @default true
   */
  useSafeArea?: boolean;

  /**
   * Whether to make the content scrollable
   * @default false
   */
  scrollable?: boolean;

  /**
   * Whether to avoid keyboard when it appears
   * @default true
   */
  avoidKeyboard?: boolean;

  /**
   * Center the content vertically
   * @default false
   */
  centerVertical?: boolean;

  /**
   * Center the content horizontally
   * @default false
   */
  centerHorizontal?: boolean;

  /**
   * Apply padding to the container
   * @default true
   */
  withPadding?: boolean;

  /**
   * Test ID for the container component
   */
  testID?: string;

  /**
   * Whether to show a light or dark status bar
   * @default follows theme
   */
  statusBarStyle?: 'light-content' | 'dark-content';
}

/**
 * A flexible container component that applies consistent styling
 * and handles common layout needs like safe areas, scrolling,
 * and keyboard avoidance.
 */
const Container: React.FC<ContainerProps> = ({
  children,
  style,
  useSafeArea = true,
  scrollable = false,
  avoidKeyboard = true,
  centerVertical = false,
  centerHorizontal = false,
  withPadding = true,
  testID,
  statusBarStyle,
}) => {
  const {theme} = useTheme();

  // Determine status bar style based on theme if not explicitly provided
  const barStyle =
    statusBarStyle || (theme.colors.statusBar);

  // Common styles for all containers
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {backgroundColor: theme.colors.primary},
    withPadding && styles.padding,
    centerVertical && styles.centerVertical,
    centerHorizontal && styles.centerHorizontal,
    style,
  ];

  // The content to render inside the container variants
  const content = (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </>
  );

  // Wrap in KeyboardAvoidingView if needed
  const keyboardAvoiding = avoidKeyboard ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  // Wrap in ScrollView if scrollable
  const scrollableContent = scrollable ? (
    <ScrollView
      contentContainerStyle={containerStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {keyboardAvoiding}
    </ScrollView>
  ) : (
    <View style={containerStyle} testID={testID}>
      {keyboardAvoiding}
    </View>
  );

  // Use SafeAreaView if requested
  if (useSafeArea) {
    return (
      <SafeAreaView style={styles.safeArea}>{scrollableContent}</SafeAreaView>
    );
  }

  return scrollableContent;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: 16,
  },
  centerVertical: {
    justifyContent: 'center',
  },
  centerHorizontal: {
    alignItems: 'center',
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
  },
});

export default memo(Container);
