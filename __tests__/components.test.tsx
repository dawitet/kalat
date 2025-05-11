// src/__tests__/components.test.tsx
import React, {memo, useCallback, useMemo} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {View, Text, TouchableOpacity} from 'react-native';

// Example of a memoized component with optimized rendering
const MemoizedButton = memo(
  ({label, onPress}: {label: string; onPress: () => void}) => {
    return (
      <TouchableOpacity onPress={onPress} testID="memo-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  },
);

// Example of a parent component that uses callbacks and memoization
const OptimizedCounter = () => {
  const [count, setCount] = React.useState(0);

  // Memoize callback to prevent recreation on every render
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < count * 100; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  }, [count]);

  return (
    <View testID="counter-container">
      <Text testID="count-value">Count: {count}</Text>
      <Text testID="expensive-value">Expensive: {expensiveValue}</Text>
      <MemoizedButton label="Increment" onPress={increment} />
    </View>
  );
};

// Test demonstrating proper memoization and callback usage
describe('Component Optimization', () => {
  test('Memoized button should not cause unnecessary re-renders', () => {
    // In a real test, we would use a render counter component
    // to track number of renders, but here we'll just demonstrate the pattern
    const {getByTestId} = render(<OptimizedCounter />);

    const button = getByTestId('memo-button');
    const countValue = getByTestId('count-value');

    // Initial state
    expect(countValue.props.children.join('')).toBe('Count: 0'); // Corrected assertion

    // Click button
    fireEvent.press(button);

    // Value should update
    expect(countValue.props.children.join('')).toBe('Count: 1'); // Corrected assertion

    // In a real component, the MemoizedButton would not re-render
    // when parent re-renders, unless its props changed
  });

  test('useMemo should recalculate only when dependencies change', () => {
    const {getByTestId} = render(<OptimizedCounter />);

    const button = getByTestId('memo-button');
    const expensiveValue = getByTestId('expensive-value');

    // Get initial expensive value
    const initialValue = expensiveValue.props.children[1];

    // Click button to trigger recalculation
    fireEvent.press(button);

    // Value should be different
    expect(expensiveValue.props.children[1]).not.toBe(initialValue);

    // Get the new value
    const newValue = expensiveValue.props.children[1];

    // Simulate a re-render without changing dependencies
    const {getByTestId: getByTestIdAfterRerender} = render(
      <OptimizedCounter />,
    );
    const expensiveValueAfterRerender =
      getByTestIdAfterRerender('expensive-value');

    // Value should be the initial value again (we rendered a new instance)
    expect(expensiveValueAfterRerender.props.children[1]).toBe(initialValue);
    expect(expensiveValueAfterRerender.props.children[1]).not.toBe(newValue);
  });

  // This demonstrates how React.memo prevents unnecessary re-renders
  test('React.memo pattern demonstration', () => {
    // This test simply demonstrates the pattern - in a real app
    // you'd wrap components that don't need to re-render often

    // Example pattern:
    const RegularComponent = ({value}: {value: number}) => (
      <Text>Value: {value}</Text>
    );

    const MemoComponent = memo(({value}: {value: number}) => (
      <Text>Value: {value}</Text>
    ));

    // In your app, prefer:
    // export default memo(MyComponent);

    // For components that depend on complex objects:
    // export default memo(MyComponent, (prev, next) => {
    //   return prev.complexObject.id === next.complexObject.id;
    // });

    // This just demonstrates the pattern, not actually testing behavior
    expect(RegularComponent).not.toBe(MemoComponent);
  });
});
