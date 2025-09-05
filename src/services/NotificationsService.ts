/**
 * NotificationsService (Web Push / in-app) — stub.
 * - In-App: utilisez Zustand + API pour persister.
 * - Web Push: service worker + VAPID (backend requis).
 */

export class NotificationsService {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied'
    return await Notification.requestPermission()
  }

  static isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  static async registerServiceWorker() {
    if (!this.isSupported()) return
    await navigator.serviceWorker.register('/sw.js') // Créez le SW côté public/
  }
}

