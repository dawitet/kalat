// __tests__/mocks/async-storage.ts
let store: Record<string, string> = {};

const mockAsyncStorage = {
  getItem: jest.fn(async (key: string): Promise<string | null> => {
    return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
  }),
  setItem: jest.fn(async (key: string, value: string): Promise<void> => {
    store[key] = value;
  }),
  removeItem: jest.fn(async (key: string): Promise<void> => {
    delete store[key];
  }),
  clear: jest.fn(async (): Promise<void> => {
    store = {};
  }),
  getAllKeys: jest.fn(async (): Promise<string[]> => {
    return Object.keys(store);
  }),
  multiGet: jest.fn(async (keys: string[]): Promise<Array<[string, string | null]>> => {
    return keys.map(key => [key, Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null]);
  }),
  multiSet: jest.fn(async (keyValuePairs: Array<[string, string]>): Promise<void> => {
    keyValuePairs.forEach(([key, value]) => {
      store[key] = value;
    });
  }),
  multiRemove: jest.fn(async (keys: string[]): Promise<void> => {
    keys.forEach(key => {
      delete store[key];
    });
  }),
  multiMerge: jest.fn(async (keyValuePairs: Array<[string, string]>): Promise<void> => {
    keyValuePairs.forEach(([key, value]) => {
      const oldValue = Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      const newValue = oldValue ? JSON.stringify({...JSON.parse(oldValue), ...JSON.parse(value)}) : value;
      store[key] = newValue;
    });
  }),
  flushGetRequests: jest.fn(),
};

export default mockAsyncStorage;
