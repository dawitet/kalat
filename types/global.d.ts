declare module '@telegram-apps/sdk-react' {
  export const popup: unknown; // Changed from any
  export const initData: unknown; // Changed from any
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
  const value: unknown; // Changed from any
  export default value;
}

declare module '*.png' {
  const value: string; // Assuming it resolves to a path or data URI
  export default value;
}

declare module '*.svg' {
  const value: React.FC<React.SVGProps<SVGSVGElement>> | string; // For React components or paths
  export default value;
}

interface NotificationRequestInput {
  content: {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
    sound?: boolean | string;
    // ... other notification content options
  };
  trigger: null | Record<string, unknown> | Date | number; // Example triggers
  identifier?: string;
}

declare module 'expo-notifications' {
  export const requestPermissionsAsync: () => Promise<{status: string}>;
  export const cancelAllScheduledNotificationsAsync: () => Promise<void>;
  export const scheduleNotificationAsync: (request: NotificationRequestInput) => Promise<string>; // Changed from any
}

declare module 'expo-permissions' {
  type PermissionType = string;
  export const askAsync: (...types: PermissionType[]) => Promise<{status: string}>; // Changed from any[]
  export const getAsync: (...types: PermissionType[]) => Promise<{status: string}>; // Changed from any[]
}
