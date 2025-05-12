// src/context/reducers/uiReducer.ts
import {UIState, UIAction, GameActionType} from '../../types'; // Added GameActionType
import {initialState} from '../initialState';

/**
 * Reducer for managing UI-related state like modals, theme, animations, etc.
 */
export const uiReducer = (state: UIState, action: UIAction | GameActionType): UIState => { // Changed action type
  switch (action.type) {
    case 'SET_ACTIVE_MODAL':
      return {
        ...state,
        activeModal: action.payload,
      };

    case 'SET_ERROR': // Assuming SET_ERROR is part of UIAction or GameActionType handled here
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'SET_THEME_PREFERENCE':
      return {
        ...state,
        themePreference: action.payload,
      };

    case 'SET_SHAKE_GRID':
      return {
        ...state,
        shouldShakeGrid: action.payload,
      };

    case 'SET_SHOW_WIN_ANIMATION':
      return {
        ...state,
        shouldShowWinAnimation: action.payload,
      };

    case 'SET_ACTIVE_SUGGESTION_FAMILY':
      return {
        ...state,
        activeSuggestionFamily: action.payload,
      };

    case 'SET_FLIPPING_ROW':
      return {
        ...state,
        flippingRowIndex: action.payload,
      };

    case 'SET_MUTED':
      return {
        ...state,
        isMuted: action.payload,
      };

    case 'SET_HINTS_ENABLED':
      return {
        ...state,
        hintsEnabled: action.payload,
      };

    case 'LOAD_PERSISTED_DATA':
      // Ensure action.payload is correctly typed or cast if necessary
      // This case should only handle UI-relevant parts of PersistedData
      if ('themePreference' in action.payload || 'hintsEnabled' in action.payload || 'isMuted' in action.payload) {
        return {
          ...state,
          themePreference:
            action.payload.themePreference || initialState.themePreference,
          hintsEnabled:
            action.payload.hintsEnabled !== undefined
              ? action.payload.hintsEnabled
              : initialState.hintsEnabled,
          isMuted:
            action.payload.isMuted !== undefined
              ? action.payload.isMuted
              : initialState.isMuted,
        };
      }
      return state; // If payload doesn't match UI concerns, return current state

    default:
      return state;
  }
};

export default uiReducer;
