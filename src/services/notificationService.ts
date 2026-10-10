import { NotificationSchedule } from '../types';
import { storage } from './storage';

class NotificationService {
  private timerId: number | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error('Failed to request notification permission', e);
      return 'denied';
    }
  }

  public playChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Pleasant double harmonic chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public sendPushNotification(title: string, body: string): boolean {
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          tag: 'pulsevibe-reminder',
        });
      } catch (err) {
        console.warn('System Notification error, falling back:', err);
      }
    }

    const schedule = storage.getNotificationSchedule();
    if (schedule.soundEnabled) {
      this.playChime();
    }
    return true;
  }

  public triggerTestReminder(): { success: boolean; message: string } {
    const perm = this.getPermission();
    const profile = storage.getGamificationProfile();
    const streak = profile.currentStreak;

    const title = 'Weekly Sentiment Check-In';
    const body = `Your voice shapes our culture! Take 60 seconds to submit your anonymous check-in & keep your ${streak}-week streak alive.`;

    if (perm === 'granted') {
      this.sendPushNotification(title, body);
      return {
        success: true,
        message: 'Push notification triggered! Check your desktop/mobile notifications.'
      };
    } else {
      this.playChime();
      return {
        success: true,
        message: 'Audio chime played! (Enable system permissions for OS-level banners).'
      };
    }
  }

  public startScheduleMonitor() {
    if (this.timerId) clearInterval(this.timerId);

    // Check periodically if current day and time matches schedule
    this.timerId = window.setInterval(() => {
      const schedule: NotificationSchedule = storage.getNotificationSchedule();
      if (!schedule.enabled) return;

      const now = new Date();
      const currentDay = now.getDay(); // 0-6
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (currentDay === schedule.dayOfWeek && currentTimeStr === schedule.time) {
        const lastDate = schedule.lastTriggered ? new Date(schedule.lastTriggered) : null;
        const isSameDay = lastDate && lastDate.toDateString() === now.toDateString();

        if (!isSameDay) {
          const profile = storage.getGamificationProfile();
          if (profile.lastCheckInWeek !== 41) {
            this.sendPushNotification(
              'Weekly Sentiment Pulse Ready',
              'Share your anonymous feedback for this week and earn +150 XP!'
            );
            storage.saveNotificationSchedule({
              ...schedule,
              lastTriggered: now.toISOString(),
            });
          }
        }
      }
    }, 60000);
  }

  public stopScheduleMonitor() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const notificationService = new NotificationService();
