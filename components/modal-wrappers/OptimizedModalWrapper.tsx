// src/components/modal-wrappers/OptimizedModalWrapper.tsx
import React from 'react';
import OptimizedModal, { OptimizedModalProps } from '../common/OptimizedModal';

/**
 * A wrapper component for OptimizedModal to make it easier to use throughout the app
 */
const OptimizedModalWrapper: React.FC<OptimizedModalProps> = (props) => {
    return <OptimizedModal {...props} />;
};

export default OptimizedModalWrapper;
