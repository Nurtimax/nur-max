/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TelegramWebApp {
  version: string;
  isFullscreen: boolean;
  platform: string;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  expand: () => void;
  ready: () => void;
  onEvent: (eventType: string, eventHandler: (data?: any) => void) => void;
  offEvent: (eventType: string, eventHandler: (data?: any) => void) => void;
  isVersionAtLeast: (version: string) => boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
