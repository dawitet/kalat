declare module '@telegram-apps/sdk-react' {
  export const popup: any;
  export const initData: any;
}

declare module 'expo-haptics' {
  export const notificationAsync: (
    type: 'success' | 'warning' | 'error',
  ) => Promise<void>;
  export const impactAsync: (
    style: 'light' | 'medium' | 'heavy',
  ) => Promise<void>;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module 'expo-notifications' {
  export const requestPermissionsAsync: () => Promise<{status: string}>;
  export const cancelAllScheduledNotificationsAsync: () => Promise<void>;
  export const scheduleNotificationAsync: (options: any) => Promise<string>;
}

declare module 'expo-permissions' {
  export const askAsync: (...args: any[]) => Promise<{status: string}>;
  export const getAsync: (...args: any[]) => Promise<{status: string}>;
}
