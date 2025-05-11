import {TransitionPresets} from '@react-navigation/stack';

export const slideTransition = {
  ...TransitionPresets.SlideFromRightIOS,
  cardStyleInterpolator: ({current, layouts}: any) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  }),
};

export const fadeTransition = {
  ...TransitionPresets.FadeFromBottomAndroid,
  cardStyleInterpolator: ({current, layouts}: any) => ({
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  }),
};

export const modalTransition = {
  ...TransitionPresets.ModalPresentationIOS,
  cardStyleInterpolator: ({current}: any) => ({
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1000, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  }),
};

export const transitions = {
  slide: slideTransition,
  fade: fadeTransition,
  modal: modalTransition,
};
