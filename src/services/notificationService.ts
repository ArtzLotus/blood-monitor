// src/services/notificationService.ts
import type { NotificationItem } from '../types';

class NotificationService {
  private timerId: number | null = null;
  private lastTriggeredKey: string = '';

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung notifikasi.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  public showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'bp-reminder',
          } as NotificationOptions);
        });
      } else {
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
        });
      }
    }
  }

  public startScheduler(notifications: NotificationItem[]) {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }

    // Cek setiap 5 detik
    this.timerId = window.setInterval(() => {
      const now = new Date();

      // Format 24 Jam -> "16:19"
      const h24 = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const time24 = `${h24}:${m}`;

      // Format 12 Jam -> "04:19 PM"
      const time12 = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Kunci pemicu per menit agar tidak spam
      if (this.lastTriggeredKey === time24) return;

      const matchingActive = notifications.find((n) => {
        if (!n.active) return false;
        const savedTime = n.time.trim().toUpperCase();
        // Cocokkan baik format 24 jam maupun 12 jam
        return savedTime === time24 || savedTime === time12.toUpperCase();
      });

      if (matchingActive) {
        this.lastTriggeredKey = time24;
        this.showNotification(
          'Waktunya Cek Tekanan Darah! 🩺',
          `Jadwal pengingat (${matchingActive.time}) telah tiba. Silakan pasang manset tensimeter Anda.`
        );
      }
    }, 5000);
  }

  public stopScheduler() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const notificationService = new NotificationService();