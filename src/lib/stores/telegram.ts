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
  // Ensure this code only runs in the browser
  if (typeof window === 'undefined') {
    console.warn("initTelegramSdk called on server, skipping.");
    return;
  }

  try {
    // Wait for window.Telegram to be available
    await new Promise<void>((resolve) => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve();
      } else {
        window.addEventListener('telegramWebAppReady', () => resolve(), { once: true });
      }
    });

    // Dynamically import SDK only when needed (client-side)
    const { SDK } = await import('@telegram-apps/sdk');
    const currentSdk = new SDK();
    await currentSdk.init();
    currentSdk.ready();
    currentSdk.requestFullscreen();

    telegram.update((store) => ({
      ...store,
      sdk: currentSdk,
      userFirstName: currentSdk.initData?.user?.firstName ?? 'Guest',
      isReady: true,
    }));
    console.log("Telegram SDK initialized successfully.");
  } catch (e) {
    console.error("Telegram SDK initialization failed:", e);
    telegram.update((store) => ({
      ...store,
      userFirstName: 'Not in Telegram',
      isReady: true,
    }));
  }
}
