// src/hooks/usePerformanceMonitor.ts
import {useRef, useEffect} from 'react';

/**
 * Options for the performance monitor
 */
interface PerformanceMonitorOptions {
  /** Component name to identify in logs */
  componentName: string;

  /** Whether to log render times to console (default: false) */
  enableLogging?: boolean;

  /** Whether to track number of renders (default: true) */
  trackRenderCount?: boolean;

  /** Number of samples to keep in memory (default: 10) */
  sampleSize?: number;
}

/**
 * Performance metrics returned by the hook
 */
interface PerformanceMetrics {
  /** Total number of renders since mount */
  renderCount: number;

  /** Average render duration in ms */
  averageRenderTime: number;

  /** Last render duration in ms */
  lastRenderTime: number;

  /** Maximum render duration in ms */
  maxRenderTime: number;

  /** Time since component mounted in ms */
  timeSinceMount: number;
}

/**
 * Hook to monitor component render performance
 *
 * @example
 * // Basic usage
 * const metrics = usePerformanceMonitor({ componentName: 'MyComponent' });
 *
 * // With logging
 * const metrics = usePerformanceMonitor({
 *   componentName: 'ExpensiveComponent',
 *   enableLogging: true,
 *   sampleSize: 20
 * });
 */
export const usePerformanceMonitor = (
  options: PerformanceMonitorOptions,
): PerformanceMetrics => {
  const {
    componentName,
    enableLogging = false,
    trackRenderCount = true,
    sampleSize = 10,
  } = options;

  // References persist across renders
  const mountTimeRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);
  const renderStartTimeRef = useRef<number>(performance.now());
  const renderHistoryRef = useRef<number[]>([]);
  const maxRenderTimeRef = useRef<number>(0);

  // Start timing this render
  renderStartTimeRef.current = performance.now();

  if (trackRenderCount) {
    renderCountRef.current += 1;
  }

  // After rendering is complete, calculate metrics
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTimeRef.current;

    // Update max render time
    if (renderDuration > maxRenderTimeRef.current) {
      maxRenderTimeRef.current = renderDuration;
    }

    // Store render duration in history
    renderHistoryRef.current.push(renderDuration);

    // Keep only the most recent samples
    if (renderHistoryRef.current.length > sampleSize) {
      renderHistoryRef.current.shift();
    }

    // Optional logging
    if (enableLogging) {
      console.log(
        `[Performance] ${componentName} rendered in ${renderDuration.toFixed(
          2,
        )}ms ` + `(render #${renderCountRef.current})`,
      );
    }

    // Clean up function
    return () => {
      // Any cleanup if needed
    };
  });

  // Calculate average render time
  const calculateAverageRenderTime = (): number => {
    if (renderHistoryRef.current.length === 0) {return 0;}

    const sum = renderHistoryRef.current.reduce((acc, time) => acc + time, 0);
    return sum / renderHistoryRef.current.length;
  };

  // Return metrics object
  return {
    renderCount: renderCountRef.current,
    averageRenderTime: calculateAverageRenderTime(),
    lastRenderTime:
      renderHistoryRef.current[renderHistoryRef.current.length - 1] || 0,
    maxRenderTime: maxRenderTimeRef.current,
    timeSinceMount: performance.now() - mountTimeRef.current,
  };
};

export default usePerformanceMonitor;
