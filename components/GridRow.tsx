// src/components/GridRow.tsx
import React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import Tile from './Tile';
import {useAnimations} from '../hooks/useAnimations';
import {TileState} from '../types';

export interface GridRowProps {
  letters: string[];
  feedback: TileState[];
  isFlipping?: boolean;
  shouldShake?: boolean;
  rowIndex?: number;
  onFlipComplete?: () => void;
  onShakeComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

const GridRow: React.FC<GridRowProps> = ({
  letters,
  feedback,
  isFlipping = false,
  shouldShake = false,
  rowIndex = 0,
  onFlipComplete,
  onShakeComplete,
  style,
}) => {
  // Get animation utilities from our hook
  const {useRowShake} = useAnimations();

  // Apply row shake animation when invalid inputs
  const {animatedStyles} = useRowShake(shouldShake, {
    duration: 500,
    onComplete: onShakeComplete,
  });

  // Track which tiles have completed flipping
  const handleTileFlipComplete = (index: number) => {
    // If this is the last tile and we have a completion callback, call it
    if (index === letters.length - 1 && onFlipComplete) {
      onFlipComplete();
    }
  };

  return (
    <Animated.View style={[styles.row, style, animatedStyles]}>
      {letters.map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          state={feedback[index] || 'empty'}
          isFlipping={isFlipping}
          tileIndex={index}
          rowIndex={rowIndex}
          onFlipComplete={() => handleTileFlipComplete(index)}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default GridRow;
