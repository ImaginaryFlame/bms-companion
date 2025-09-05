import { LiveService, type LiveDetails } from './LiveService'

export type HasJoelStatus = LiveDetails & {
  checkedAt: Date
  source: 'twitch' | 'stub'
}

export class HasJoelService {
  static async getStatus(): Promise<HasJoelStatus> {
    const login = (import.meta.env.VITE_TWITCH_USER_LOGIN as string) || 'bmsjoel'
    try {
      const d = await LiveService.getDetails(login)
      return { ...d, checkedAt: new Date(), source: 'twitch' }
    } catch (e) {
      console.warn('HasJoelService fallback (stub):', e)
      return { live: false, checkedAt: new Date(), source: 'stub' }
    }
  }
}
