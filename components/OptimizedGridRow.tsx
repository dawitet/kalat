// src/components/OptimizedGridRow.tsx
import React, {memo, useCallback, useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import OptimizedTile from './OptimizedTile';
import {TileState} from '../types';
import {useAnimations} from '../hooks/useAnimations';
import Animated from 'react-native-reanimated';
import {useCardAnimation} from '../hooks/useCardAnimation';

export interface OptimizedGridRowProps {
  letters: string[];
  feedback: TileState[];
  isCurrentRow?: boolean;
  isFlipping?: boolean;
  shouldShake?: boolean;
  rowIndex: number;
  onFlipComplete?: () => void;
  onShakeComplete?: () => void;
}

/**
 * Optimized grid row component with memoization and animation optimizations
 */
const OptimizedGridRow: React.FC<OptimizedGridRowProps> = ({
  letters,
  feedback,
  isCurrentRow = false,
  isFlipping = false,
  shouldShake = false,
  rowIndex,
  onFlipComplete,
  onShakeComplete,
}) => {
  // Use animation hooks
  const {useRowShake} = useAnimations();

  // Use card animation for row entry
  const {animStyle: entryAnimStyle} = useCardAnimation(true, {
    delay: rowIndex * 100,
    useNativeDriver: true,
  });

  // Use shake animation for invalid guesses
  const {animatedStyles: shakeAnimStyles} = useRowShake(shouldShake, {
    duration: 600,
    onComplete: onShakeComplete,
  });

  // Combine animations with properly ordered transforms
  const combinedAnimationStyle = useMemo(() => {
    return [entryAnimStyle, shakeAnimStyles];
  }, [entryAnimStyle, shakeAnimStyles]);

  // Memoize handler for flip completion
  const handleFlipComplete = useCallback(() => {
    if (onFlipComplete) {
      onFlipComplete();
    }
  }, [onFlipComplete]);

  // Memoize tiles to prevent unnecessary re-renders
  const tiles = useMemo(() => {
    return letters.map((letter, index) => {
      const shouldFlip = isFlipping;
      const tileState = feedback[index] || 'empty';

      return (
        <OptimizedTile
          key={`${rowIndex}-${index}`}
          letter={letter}
          state={tileState}
          position={index}
          isFlipping={shouldFlip}
          onFlipComplete={
            index === letters.length - 1 ? handleFlipComplete : undefined
          }
          delay={index * 180} // Stagger the flips
        />
      );
    });
  }, [letters, feedback, isFlipping, rowIndex, handleFlipComplete]);

  return (
    <Animated.View style={[styles.row, combinedAnimationStyle]}>
      {tiles}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
});

export default memo(OptimizedGridRow);
