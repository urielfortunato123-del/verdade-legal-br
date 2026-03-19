import { useCallback, useRef } from "react";
import { toast } from "sonner";

export function useBreakingNewsAlert() {
  const lastSeenTitles = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstLoad = useRef(true);

  const playAlertSound = useCallback(() => {
    try {
      // Create a simple alert tone using Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 880;
      osc1.type = "sine";
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      // Second beep (higher)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc2.start(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn("Could not play alert sound:", e);
    }
  }, []);

  const sendPushNotification = useCallback((title: string, source: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`🔴 ${source} - Breaking News`, {
        body: title,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: "breaking-news",
        renotify: true,
      });
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const result = await Notification.requestPermission();
      return result === "granted";
    }
    return Notification.permission === "granted";
  }, []);

  const checkForBreakingNews = useCallback(
    (news: { title: string; source: string; link: string }[]) => {
      if (!news?.length) return;

      // On first load, just populate the set without alerting
      if (isFirstLoad.current) {
        news.forEach((item) => lastSeenTitles.current.add(item.title));
        isFirstLoad.current = false;
        return;
      }

      const newHeadlines = news.filter(
        (item) => !lastSeenTitles.current.has(item.title)
      );

      if (newHeadlines.length > 0) {
        // Update seen titles
        news.forEach((item) => lastSeenTitles.current.add(item.title));

        // Alert for each new headline (max 3)
        const toAlert = newHeadlines.slice(0, 3);
        
        playAlertSound();

        toAlert.forEach((item, i) => {
          setTimeout(() => {
            toast.info(`🔴 ${item.source}`, {
              description: item.title,
              duration: 8000,
              action: {
                label: "Ver",
                onClick: () => window.open(item.link, "_blank"),
              },
            });
            sendPushNotification(item.title, item.source);
          }, i * 500);
        });
      }
    },
    [playAlertSound, sendPushNotification]
  );

  return {
    checkForBreakingNews,
    requestNotificationPermission,
  };
}
