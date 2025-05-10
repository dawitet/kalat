import { useCallback } from 'react';
import {
    useSharedValue,
    withTiming,
    withSpring,
    Easing,
} from 'react-native-reanimated';

interface AnimationParams {
    onComplete?: () => void;
    duration?: number;
}

export const useAnimations = () => {
    const shakeAnim = useSharedValue(0);
    const flipAnim = useSharedValue(0);
    const popInAnim = useSharedValue(0);

    const shakeAnimation = useCallback((params?: AnimationParams) => {
        shakeAnim.value = 0; // Reset before animation
        shakeAnim.value = withTiming(1, { duration: params?.duration || 500, easing: Easing.bounce }, () => {
            shakeAnim.value = 0; // Reset after animation
            if (params?.onComplete) {
                params.onComplete(); // Direct call for now
            }
        });
    }, [shakeAnim]);

    const flipAnimation = useCallback((params?: AnimationParams) => {
        flipAnim.value = 0;
        flipAnim.value = withTiming(1, { duration: params?.duration || 600, easing: Easing.inOut(Easing.ease) }, () => {
            if (params?.onComplete) {
                params.onComplete();
            }
        });
    }, [flipAnim]);

    const popInAnimation = useCallback((params?: AnimationParams) => {
        popInAnim.value = 0;
        popInAnim.value = withSpring(1, { damping: 15, stiffness: 150, mass: 0.5 }, () => {
            if (params?.onComplete) {
                params.onComplete();
            }
        });
    }, [popInAnim]);

    return {
        shakeAnimValue: shakeAnim,
        flipAnimValue: flipAnim,
        popInAnimValue: popInAnim,
        triggerShake: shakeAnimation,
        triggerFlip: flipAnimation,
        triggerPopIn: popInAnimation,
    };
};
