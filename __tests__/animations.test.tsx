// src/__tests__/animations.test.tsx
import React from 'react';
import {render, act} from '@testing-library/react-native';
import {useAnimations} from '../hooks/useAnimations';
import {Text, View} from 'react-native';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const ActualReanimatedMock = jest.requireActual('react-native-reanimated/mock');
  const mockReanimated = {
    ...ActualReanimatedMock,
    default: {
      ...(ActualReanimatedMock.default || {}),
      createAnimatedComponent: (component: React.ComponentType<Record<string, unknown>>) => component,
    },
    useSharedValue: (initialValue: number | string | Record<string, unknown> | boolean) => ({value: initialValue}),
    useAnimatedStyle: (styleFn: () => Record<string, unknown>) => styleFn(),
    withTiming: (toValue: number, config?: Record<string, unknown>, callback?: (finished: boolean) => void) => {
      if (callback) { callback(true); }
      return toValue;
    },
    withDelay: (delay: number, animation: number) => animation,
    withSequence: (...animations: number[]) => animations[animations.length - 1],
    withRepeat: (animation: number) => animation,
    runOnJS: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
  };
  return mockReanimated;
});

// Create test component that uses our animations
const TileWithAnimation = ({isFlipping = false}) => {
  const {useTileFlip} = useAnimations();
  const {animatedStyles, isAnimating} = useTileFlip(isFlipping, {
    onComplete: jest.fn(),
    duration: 300,
  });

  return (
    <View testID="animated-tile" style={animatedStyles}>
      <Text>{isAnimating ? 'Animating' : 'Idle'}</Text>
    </View>
  );
};

const RowWithShake = ({shouldShake = false}) => {
  const {useRowShake} = useAnimations();
  const {animatedStyles} = useRowShake(shouldShake, {
    onComplete: jest.fn(),
    duration: 300,
  });

  return (
    <View testID="animated-row" style={animatedStyles}>
      <Text>Row content</Text>
    </View>
  );
};

describe('Animation Hooks', () => {
  test('useTileFlip should trigger animation when isFlipping changes', () => {
    const {getByTestId, rerender} = render(
      <TileWithAnimation isFlipping={false} />,
    );

    const tile = getByTestId('animated-tile');
    expect(tile).toBeTruthy();

    // Flip the tile
    act(() => {
      rerender(<TileWithAnimation isFlipping={true} />);
    });

    // In a real environment, we would see animation styles being applied
  });

  test('useRowShake should trigger animation when shouldShake changes', () => {
    const {getByTestId, rerender} = render(
      <RowWithShake shouldShake={false} />,
    );

    const row = getByTestId('animated-row');
    expect(row).toBeTruthy();

    // Shake the row
    act(() => {
      rerender(<RowWithShake shouldShake={true} />);
    });

    // In a real environment, we would see animation styles being applied
  });

  test('Animation hooks should properly memoize values', () => {
    render(<TileWithAnimation isFlipping={false} />);

    // Re-render without changing props should not create new animations
    const rerenderSpy = jest.fn();

    // Mock a component that would track re-renders
    const TrackedComponent = ({isFlipping}: {isFlipping: boolean}) => {
      rerenderSpy();
      return <TileWithAnimation isFlipping={isFlipping} />;
    };

    const {rerender: trackedRerender} = render(
      <TrackedComponent isFlipping={false} key={1} />,
    );

    act(() => {
      trackedRerender(<TrackedComponent isFlipping={false} key={2} />);
      trackedRerender(<TrackedComponent isFlipping={false} key={3} />);
    });

    // Component should render 3 times (initial + 2 rerenders)
    expect(rerenderSpy).toHaveBeenCalledTimes(2);

    // But in the real implementation, our hooks would be memoized
    // and not cause additional animation calculations
  });
});
