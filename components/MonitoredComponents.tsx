// src/components/MonitoredComponents.tsx
import {withPerformanceMonitoring} from './OptimizedPerformanceWrapper';

// Import original components
import Grid from './Grid';
import Keyboard from './Keyboard';
import Tile from './Tile';
import GridRow from './GridRow';
import SuggestionArea from './SuggestionArea';
import MainMenu from './MainMenu';
import DifficultySelector from './DifficultySelector';
import LoadingScreen from './LoadingScreen';

// Import optimized components
import OptimizedGrid from './OptimizedGrid';
import OptimizedKeyboard from './OptimizedKeyboard';
import OptimizedTile from './OptimizedTile';
import OptimizedGridRow from './OptimizedGridRow';
import OptimizedSuggestionArea from './OptimizedSuggestionArea';
import OptimizedMainMenu from './OptimizedMainMenu';
import OptimizedDifficultySelector from './OptimizedDifficultySelector';
import OptimizedLoadingScreen from './OptimizedLoadingScreen';

/**
 * Original components wrapped with performance monitoring
 */
export const MonitoredComponents = {
  // Original components with monitoring
  Grid: withPerformanceMonitoring(Grid, {
    enableLogging: true,
    showOverlay: true,
  }),
  Keyboard: withPerformanceMonitoring(Keyboard, {
    enableLogging: true,
    showOverlay: true,
  }),
  Tile: withPerformanceMonitoring(Tile, {
    enableLogging: false,
    showOverlay: false, // Too many instances, would clutter UI
  }),
  GridRow: withPerformanceMonitoring(GridRow, {
    enableLogging: false,
    showOverlay: false, // Too many instances
  }),
  SuggestionArea: withPerformanceMonitoring(SuggestionArea, {
    enableLogging: true,
    showOverlay: true,
  }),
  MainMenu: withPerformanceMonitoring(MainMenu, {
    enableLogging: true,
    showOverlay: true,
  }),
  DifficultySelector: withPerformanceMonitoring(DifficultySelector, {
    enableLogging: true,
    showOverlay: true,
  }),
  LoadingScreen: withPerformanceMonitoring(LoadingScreen, {
    enableLogging: true,
    showOverlay: true,
  }),
};

/**
 * Optimized components wrapped with performance monitoring
 */
export const MonitoredOptimizedComponents = {
  // Optimized components with monitoring
  Grid: withPerformanceMonitoring(OptimizedGrid, {
    enableLogging: true,
    showOverlay: true,
  }),
  Keyboard: withPerformanceMonitoring(OptimizedKeyboard, {
    enableLogging: true,
    showOverlay: true,
  }),
  Tile: withPerformanceMonitoring(OptimizedTile, {
    enableLogging: false,
    showOverlay: false, // Too many instances
  }),
  GridRow: withPerformanceMonitoring(OptimizedGridRow, {
    enableLogging: false,
    showOverlay: false, // Too many instances
  }),
  SuggestionArea: withPerformanceMonitoring(OptimizedSuggestionArea, {
    enableLogging: true,
    showOverlay: true,
  }),
  MainMenu: withPerformanceMonitoring(OptimizedMainMenu, {
    enableLogging: true,
    showOverlay: true,
  }),
  DifficultySelector: withPerformanceMonitoring(OptimizedDifficultySelector, {
    enableLogging: true,
    showOverlay: true,
  }),
  LoadingScreen: withPerformanceMonitoring(OptimizedLoadingScreen, {
    enableLogging: true,
    showOverlay: true,
  }),
};

/**
 * This file exports both original and optimized components with performance monitoring.
 * This allows us to:
 * 1. Compare the performance metrics between original and optimized versions
 * 2. Easily swap between versions for A/B testing
 * 3. Document the performance improvements
 *
 * Use these components only during development or testing.
 * For production, use the actual optimized components directly.
 */
