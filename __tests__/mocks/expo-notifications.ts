// __tests__/mocks/expo-notifications.ts
export const requestPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));
export const cancelAllScheduledNotificationsAsync = jest.fn(async () => {});
export const scheduleNotificationAsync = jest.fn(async () => 'mock-notification-id');

// Add any other functions from expo-notifications that your app uses
export const getPermissionsAsync = jest.fn(async () => ({ status: 'granted' }));
export const setNotificationHandler = jest.fn();
export const addNotificationReceivedListener = jest.fn(() => ({ remove: jest.fn() }));
export const addNotificationResponseReceivedListener = jest.fn(() => ({ remove: jest.fn() }));
