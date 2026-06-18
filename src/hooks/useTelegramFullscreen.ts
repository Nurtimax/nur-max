/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTelegramFullscreen.ts
import { useState, useEffect, useCallback } from "react";

const tg = window.Telegram?.WebApp as any;

export const useTelegramFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [version, setVersion] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (!tg) {
      setIsReady(true);
      return;
    }

    const init = () => {
      setVersion(tg.version || "");
      setIsFullscreen(tg.isFullscreen || false);
      setPlatform(tg.platform || null);

      // Check if fullscreen is supported (Bot API 8.0+)
      const supported = tg.isVersionAtLeast?.("8.0") || false;
      setIsSupported(supported);
      setIsReady(true);
    };

    init();

    // Listen to fullscreen changes
    const handleFullscreenChanged = () => {
      setIsFullscreen(tg.isFullscreen || false);
    };

    tg.onEvent?.("fullscreenChanged", handleFullscreenChanged);

    return () => {
      tg.offEvent?.("fullscreenChanged", handleFullscreenChanged);
    };
  }, []);

  const enterFullscreen = useCallback(() => {
    if (!tg) return false;

    if (!isSupported) {
      console.warn(
        `Fullscreen requires Bot API 8.0+. Current version: ${version}`,
      );
      // Fallback: expand instead
      tg.expand?.();
      return false;
    }

    try {
      tg.requestFullscreen?.();
      setIsFullscreen(true);
      return true;
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      // Fallback: expand
      tg.expand?.();
      return false;
    }
  }, [isSupported, version]);

  const exitFullscreen = useCallback(() => {
    if (!tg) return false;

    try {
      tg.exitFullscreen?.();
      setIsFullscreen(false);
      return true;
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
      return false;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      return exitFullscreen();
    }
    return enterFullscreen();
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    platform,
    isFullscreen,
    isSupported,
    version,
    isReady,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
};
