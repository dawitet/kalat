// src/mobile/components/BottomSheet.tsx
import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../providers/ThemeProvider';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  targetHeightPercentage: number;
  showDragHandle?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  targetHeightPercentage,
  showDragHandle = true,
}) => {
  const {height: windowHeight} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const clampedPercentage = Math.max(10, Math.min(95, targetHeightPercentage));
  const sheetHeight = windowHeight * (clampedPercentage / 100);

  useEffect(() => {
    if (isOpen) {
      Animated.timing(animatedHeight, {
        toValue: sheetHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen, sheetHeight, animatedHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          animatedHeight.setValue(sheetHeight - gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > sheetHeight * 0.4 || gestureState.vy > 0.5) {
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start(onClose);
        } else {
          Animated.spring(animatedHeight, {
            toValue: sheetHeight,
            useNativeDriver: false,
            bounciness: 2,
          }).start();
        }
      },
    }),
  ).current;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'flex-end',
    },
    sheetContainer: {
      width: '100%',
      backgroundColor: theme.colors.secondary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -3},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
      overflow: 'hidden',
    },
    dragHandleContainer: {
      alignItems: 'center',
      paddingVertical: 10,
      ...(Platform.OS === 'ios' ? panResponder.panHandlers : {}),
    },
    dragHandle: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: theme.colors.hint,
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingTop: title && !showDragHandle ? 15 : 0,
      paddingBottom: 10,
      borderBottomWidth: title ? 1 : 0,
      borderBottomColor: theme.colors.border,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.colors.text,
    },
    scrollView: {},
    contentContainerStyle: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: insets.bottom + 20,
    },
  });

  const DragHandleWrapper = Platform.OS === 'android' ? View : React.Fragment;
  const dragHandleWrapperProps =
    Platform.OS === 'android' ? {...panResponder.panHandlers} : {};

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheetContainer, {height: animatedHeight}]}>
        <DragHandleWrapper {...dragHandleWrapperProps}>
          {showDragHandle && (
            <View
              style={styles.dragHandleContainer}
              {...(Platform.OS === 'ios' ? panResponder.panHandlers : {})}>
              <View style={styles.dragHandle} />
            </View>
          )}
        </DragHandleWrapper>
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          {...(Platform.OS === 'android' && showDragHandle
            ? {}
            : panResponder.panHandlers)}>
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;
