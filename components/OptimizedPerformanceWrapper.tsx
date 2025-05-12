// src/components/OptimizedPerformanceWrapper.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';

/**
 * Options for the performance wrapper
 */
interface PerformanceWrapperOptions {
  /** Enable console logging of render metrics */
  enableLogging?: boolean;

  /** Display metrics overlay on the component */
  showOverlay?: boolean;

  /** Number of samples to track for averages */
  sampleSize?: number;
}

/**
 * Higher-order component that wraps a component with performance monitoring
 *
 * @example
 * // Basic usage
 * const MonitoredComponent = withPerformanceMonitoring(MyComponent);
 *
 * // With options
 * const MonitoredComponent = withPerformanceMonitoring(ExpensiveComponent, {
 *   enableLogging: true,
 *   showOverlay: __DEV__,
 *   sampleSize: 20
 * });
 */
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: PerformanceWrapperOptions = {},
) {
  const {
    enableLogging = false,
    showOverlay = __DEV__, // Only show in development by default
    sampleSize = 10,
  } = options;

  // Create a wrapper component that includes monitoring
  const WithPerformanceMonitoring = (props: P) => {
    // Get component name for display/logging
    const componentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    // Use our performance monitor hook
    const metrics = usePerformanceMonitor({
      componentName,
      enableLogging,
      sampleSize,
    });

    // Render the component with optional overlay
    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />

        {showOverlay && (
          <View style={styles.overlay}>
            <Text style={styles.metricText}>
              {componentName} renders: {metrics.renderCount}
            </Text>
            <Text style={styles.metricText}>
              Avg: {metrics.averageRenderTime.toFixed(2)}ms
            </Text>
            <Text style={styles.metricText}>
              Max: {metrics.maxRenderTime.toFixed(2)}ms
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Set display name for debugging
  WithPerformanceMonitoring.displayName = `WithPerformanceMonitoring(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithPerformanceMonitoring;
}

/**
 * Styles for the performance wrapper
 */
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 4,
    zIndex: 9999,
  },
  metricText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default withPerformanceMonitoring;
