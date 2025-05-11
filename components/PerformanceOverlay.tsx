// src/components/PerformanceOverlay.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

interface PerformanceOverlayProps {
  isVisible?: boolean;
  onToggle?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  backgroundColor?: string;
  textColor?: string;
}

// Global metrics registry
const metricsRegistry: Record<string, ComponentMetrics> = {};

// Register a component's metrics
export const registerComponentMetrics = (metrics: ComponentMetrics) => {
  metricsRegistry[metrics.componentName] = metrics;
};

/**
 * Performance Overlay component for real-time monitoring
 * Shows component render counts and times during development
 */
const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  isVisible = true,
  onToggle,
  position = 'bottom-right',
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  textColor = '#fff',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState<ComponentMetrics[]>([]);
  const [fps, setFps] = useState(0);

  // Animation for expand/collapse
  const height = useSharedValue(expanded ? 300 : 40);

  useEffect(() => {
    height.value = withTiming(expanded ? 300 : 40, { duration: 300 });
  }, [expanded, height]);

  // Update metrics periodically
  useEffect(() => {
    if (!isVisible) {return;}

    const intervalId = setInterval(() => {
      const metricsList = Object.values(metricsRegistry);
      setMetrics(metricsList.sort((a, b) => b.renderCount - a.renderCount));
    }, 500);

    return () => clearInterval(intervalId);
  }, [isVisible]);

  // Calculate FPS
  useEffect(() => {
    if (!isVisible) {return;}

    let frameCount = 0;
    let lastTime = performance.now();

    const calculateFps = () => {
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = now;
      }

      frameCount++;
      requestAnimationFrame(calculateFps);
    };

    const requestId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(requestId);
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  if (!isVisible) {return null;}

  // Position styles
  const positionStyle = {
    'top-left': { top: 40, left: 10 },
    'top-right': { top: 40, right: 10 },
    'bottom-left': { bottom: 10, left: 10 },
    'bottom-right': { bottom: 10, right: 10 },
  }[position];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        positionStyle,
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerText, { color: textColor }]}>
            Performance{expanded ? '' : `: ${fps} FPS, ${metrics.length} Components`}
          </Text>
          {onToggle && (
            <TouchableOpacity onPress={onToggle} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: textColor }]}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <ScrollView style={styles.metricsContainer}>
          <View style={styles.row}>
            <Text style={[styles.headerCell, { color: textColor }]}>Component</Text>
            <Text style={[styles.headerCell, { color: textColor }]}>Renders</Text>
            <Text style={[styles.headerCell, { color: textColor }]}>Avg Time</Text>
          </View>

          {metrics.map((metric) => (
            <View key={metric.componentName} style={styles.row}>
              <Text style={[styles.cell, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">
                {metric.componentName}
              </Text>
              <Text style={[styles.cell, { color: textColor }]}>
                {metric.renderCount}
              </Text>
              <Text style={[styles.cell, { color: textColor }]}>
                {metric.averageRenderTime.toFixed(2)} ms
              </Text>
            </View>
          ))}

          <View style={styles.summary}>
            <Text style={[styles.summaryText, { color: textColor }]}>
              FPS: {fps} | Total Components: {metrics.length}
            </Text>
          </View>
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 250,
    maxHeight: 300,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  header: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    fontSize: 11,
    flex: 1,
    textAlign: 'center',
  },
  summary: {
    padding: 10,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default React.memo(PerformanceOverlay);
