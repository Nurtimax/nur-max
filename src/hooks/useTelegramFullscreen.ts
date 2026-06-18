/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTelegramFullscreen.ts
import { useState, useEffect } from "react";

const tg = window.Telegram?.WebApp as any;

export const useTelegramFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (!tg) {
      return;
    }

    const init = () => {
      setIsFullscreen(tg.isFullscreen || false);
      setPlatform(tg.platform || null);
    };

    init();
  }, []);

  return {
    platform,
    isFullscreen,
  };
};
