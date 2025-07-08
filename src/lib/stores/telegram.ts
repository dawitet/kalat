import { writable } from 'svelte/store';
import type { SDK } from '@telegram-apps/sdk'; // Keep type import for type checking

interface TelegramStore {
  sdk: SDK | null;
  userFirstName: string | null;
  isReady: boolean;
}

const initialStore: TelegramStore = {
  sdk: null,
  userFirstName: null,
  isReady: false,
};

export const telegram = writable<TelegramStore>(initialStore);

export async function initTelegramSdk() {
  try {
    // Dynamically import SDK only when needed (client-side)
    const { SDK } = await import('@telegram-apps/sdk');
    const currentSdk = new SDK();
    await currentSdk.init();
    currentSdk.ready();

    telegram.update((store) => ({
      ...store,
      sdk: currentSdk,
      userFirstName: currentSdk.initData?.user?.firstName ?? 'Guest',
      isReady: true,
    }));
  } catch (e) {
    console.error("Telegram SDK initialization failed:", e);
    telegram.update((store) => ({
      ...store,
      userFirstName: 'Not in Telegram',
      isReady: true,
    }));
  }
}