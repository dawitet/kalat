# React Native Performance Optimization Patterns

This guide outlines the performance optimization patterns that have been applied to the Kalat React Native word game application. Use these patterns when developing or modifying components to ensure consistent, high-performance user experiences.

## 1. Component Optimization Patterns

### 1.1 Component Memoization

Use React's memoization features to prevent unnecessary re-renders:

```tsx
// Memoize entire components
const OptimizedComponent = React.memo(({ prop1, prop2 }) => {
  return <View>...</View>;
});

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(dep1, dep2);
}, [dep1, dep2]);

// Memoize callback functions
const handlePress = useCallback(() => {
  performAction();
}, [dependencies]);
```

### 1.2 Style Optimization

Optimize style definitions to improve render performance:

```tsx
// BAD: Creating styles inside render function
const Component = () => {
  return (
    <View style={{ padding: 10, margin: 5 }}>...</View>
  );
};

// GOOD: Using StyleSheet outside component
const styles = StyleSheet.create({
  container: { padding: 10, margin: 5 },
});

const Component = () => {
  return <View style={styles.container}>...</View>;
};

// BETTER: Using memoized dynamic styles
const Component = ({ highlighted }) => {
  const dynamicStyle = useMemo(() => ({
    backgroundColor: highlighted ? 'yellow' : 'transparent', 
  }), [highlighted]);
  
  return <View style={[styles.container, dynamicStyle]}>...</View>;
};
```

## 2. Animation Performance Patterns

### 2.1 Native Driver

Always use the native driver for animations when possible:

```tsx
// Use native driver in Animated API
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Run animation on UI thread
}).start();

// For Reanimated 2, use worklets
const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
  };
});
```

### 2.2 Animation Hooks

Use custom animation hooks to encapsulate animation logic:

```tsx
// Reusable animation hook
const useCardAnimation = (visible, options = {}) => {
  const animValue = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      animValue.value = withSpring(1, options);
    } else {
      animValue.value = withTiming(0, options);
    }
  }, [visible]);
  
  const animStyle = useAnimatedStyle(() => ({
    opacity: animValue.value,
    transform: [{ scale: interpolate(animValue.value, [0, 1], [0.8, 1]) }],
  }));
  
  return { animValue, animStyle };
};
```

## 3. Rendering Optimization Patterns

### 3.1 List Rendering

Optimize list rendering for large data sets:

```tsx
// BAD: Rendering arrays with map
{items.map(item => <Item key={item.id} {...item} />)}

// GOOD: Using FlatList with optimizations
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={item => item.id}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  initialNumToRender={5}
/>
```

### 3.2 Conditional Rendering

Optimize conditional rendering logic:

```tsx
// BAD: Complex conditionals in JSX
{isLoading ? (
  <LoadingComponent />
) : error ? (
  <ErrorComponent error={error} />
) : data ? (
  <DataComponent data={data} />
) : (
  <EmptyComponent />
)}

// GOOD: Move rendering logic to functions or variables
const renderContent = () => {
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} />;
  if (!data) return <EmptyComponent />;
  return <DataComponent data={data} />;
};

return <View>{renderContent()}</View>;
```

## 4. State Management Optimization Patterns

### 4.1 Reducer Pattern

Use the reducer pattern for complex state management:

```tsx
// Separate reducers by concern
const uiReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    // More UI-related actions...
    default:
      return state;
  }
};

const gameReducer = (state, action) => {
  // Game logic actions...
};

// Combine reducers
const rootReducer = (state, action) => ({
  ui: uiReducer(state.ui, action),
  game: gameReducer(state.game, action),
});
```

### 4.2 State Selectors

Use memoized selectors to access derived state:

```tsx
// Create memoized selectors
const selectCurrentProgress = (state) => {
  const { currentDifficulty, gameProgress } = state;
  return currentDifficulty ? gameProgress[currentDifficulty] : null;
};

// Use them in components
const currentProgress = useMemo(
  () => selectCurrentProgress(gameState), 
  [gameState]
);
```

## 5. Code Splitting Patterns

### 5.1 Component Lazy Loading

Dynamically import components when needed:

```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const MyComponent = () => {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <>
      <Button onPress={() => setShowHeavy(true)} title="Load" />
      {showHeavy && (
        <React.Suspense fallback={<LoadingIndicator />}>
          <HeavyComponent />
        </React.Suspense>
      )}
    </>
  );
};
```

## 6. Debugging Performance Issues

### 6.1 Using React DevTools Profiler

The React DevTools Profiler is essential for identifying performance bottlenecks:

1. Install React DevTools
2. Run your app in development mode
3. Connect to React DevTools and use the Profiler tab
4. Record interactions and look for components with high render times

### 6.2 LogBox Monitoring

Pay attention to performance warnings in LogBox:

```tsx
// Silence specific warnings if needed (but fix them when possible)
LogBox.ignoreLogs(['Expensive operation']);

// Better: Fix the underlying issue
```

## 7. Testing for Performance

### 7.1 Render Tests

Create tests that verify your optimizations work:

```tsx
// Test that memoization prevents re-renders
it('does not re-render when irrelevant props change', () => {
  const renderSpy = jest.fn();
  const MemoComponent = memo(() => {
    renderSpy();
    return <View />;
  });
  
  const { rerender } = render(
    <ParentComponent relevantProp="a" irrelevantProp="x">
      <MemoComponent />
    </ParentComponent>
  );
  
  // Should not cause MemoComponent to re-render
  rerender(
    <ParentComponent relevantProp="a" irrelevantProp="y">
      <MemoComponent />
    </ParentComponent>
  );
  
  expect(renderSpy).toHaveBeenCalledTimes(1);
});
```

Remember, performance optimization is an ongoing process. Use these patterns consistently and measure their impact to ensure the best user experience for your React Native application.
