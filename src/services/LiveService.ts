/**
 * LiveService: integration Twitch (Helix)
 * Implements client_credentials OAuth flow and exposes helpers to fetch live details.
 * WARNING: Never ship client_secret in production, prefer a backend proxy.
 */

export type MonthlyTime = { hours: number; minutes: number }
export type LiveDetails = {
  live: boolean
  title?: string
  startedAt?: string
  streamer?: { id: string; login: string; displayName: string; avatarUrl: string }
  streamUrl?: string
  streamThumbnail?: string
  lastStreamAt?: string
  monthlyStreamTime?: MonthlyTime
}

export type LiveDetailsBatchItem = {
  login: string
  details?: LiveDetails
  error?: string
}

const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const TWITCH_API = 'https://api.twitch.tv/helix'
import { FALLBACK_TWITCH_CLIENT_ID, FALLBACK_TWITCH_CLIENT_SECRET } from '@/config/fallbackTwitch'

async function fetchJson(url: string, init: RequestInit = {}) {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

function parseDurationToMinutes(duration: string): number {
  // Twitch duration format e.g. "1h2m3s", components optional
  const h = parseInt(/(\d+)h/.exec(duration)?.[1] ?? '0', 10)
  const m = parseInt(/(\d+)m/.exec(duration)?.[1] ?? '0', 10)
  const s = parseInt(/(\d+)s/.exec(duration)?.[1] ?? '0', 10)
  return h * 60 + m + Math.floor(s / 60)
}

function computeMonthlyTime(videos: Array<{ duration: string }>): MonthlyTime {
  let totalMinutes = 0
  for (const v of videos) totalMinutes += parseDurationToMinutes(v.duration || '0h0m0s')
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: Math.floor(totalMinutes % 60),
  }
}

export class LiveService {
  static async getAccessToken(): Promise<string> {
    let clientId = import.meta.env.VITE_TWITCH_CLIENT_ID as string | undefined
    let clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET as string | undefined
    if (!clientId || !clientSecret) {
      clientId = clientId || FALLBACK_TWITCH_CLIENT_ID
      clientSecret = clientSecret || FALLBACK_TWITCH_CLIENT_SECRET
    }
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    })
    const data = await fetchJson(TWITCH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    return data.access_token as string
  }

  static getClientId(): string {
    const envId = import.meta.env.VITE_TWITCH_CLIENT_ID as string | undefined
    return envId || FALLBACK_TWITCH_CLIENT_ID
  }

  static async getUser(accessToken: string, login: string) {
    const clientId = this.getClientId()
    const data = await fetchJson(`${TWITCH_API}/users?login=${encodeURIComponent(login)}`, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    const user = data.data?.[0]
    if (!user) throw new Error('Streamer introuvable')
    return user as { id: string; login: string; display_name: string; profile_image_url: string }
  }

  static async getStreams(accessToken: string, userId: string) {
    const clientId = this.getClientId()
    const data = await fetchJson(`${TWITCH_API}/streams?user_id=${encodeURIComponent(userId)}`, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    return data.data as Array<{ id: string; title: string; started_at: string; thumbnail_url: string }>
  }

  static async getVideosLast30Days(accessToken: string, userId: string) {
    const clientId = this.getClientId()
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    const url = `${TWITCH_API}/videos?user_id=${encodeURIComponent(userId)}&type=archive&first=100&started_at=${startDate.toISOString()}&ended_at=${endDate.toISOString()}`
    const data = await fetchJson(url, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    return data.data as Array<{ created_at: string; duration: string }>
  }

  private static mapDetails(
    user: { id: string; login: string; display_name: string; profile_image_url: string },
    stream: { id: string; title: string; started_at: string; thumbnail_url: string } | undefined,
    videos: Array<{ created_at: string; duration: string }>,
  ): LiveDetails {
    const live = !!stream
    let streamThumbnail: string | undefined
    if (stream?.thumbnail_url) {
      streamThumbnail = stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360')
    }

    const monthlyStreamTime = videos.length ? computeMonthlyTime(videos) : undefined
    const lastStreamAt = videos[0]?.created_at

    return {
      live,
      title: stream?.title,
      startedAt: stream?.started_at,
      streamer: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        avatarUrl: user.profile_image_url,
      },
      streamUrl: `https://twitch.tv/${user.login}`,
      streamThumbnail,
      lastStreamAt,
      monthlyStreamTime,
    }
  }

  private static async getDetailsWithToken(accessToken: string, userLogin: string): Promise<LiveDetails> {
    const user = await this.getUser(accessToken, userLogin)
    const [streams, videos] = await Promise.all([
      this.getStreams(accessToken, user.id),
      this.getVideosLast30Days(accessToken, user.id),
    ])
    const stream = streams?.[0]
    return this.mapDetails(user, stream, videos ?? [])
  }

  static async getDetails(userLogin: string): Promise<LiveDetails> {
    const token = await this.getAccessToken()
    return this.getDetailsWithToken(token, userLogin)
  }

  static async getDetailsBatch(logins: string[]): Promise<LiveDetailsBatchItem[]> {
    if (!logins.length) return []
    const token = await this.getAccessToken()
    const results = await Promise.all(
      logins.map(async (login) => {
        try {
          const details = await this.getDetailsWithToken(token, login)
          return { login, details }
        } catch (error) {
          console.warn('LiveService.getDetailsBatch error', login, error)
          const message = error instanceof Error ? error.message : 'Erreur inconnue'
          return { login, error: message }
        }
      }),
    )
    return results
  }

  static async isLive(userLogin: string): Promise<{ live: boolean }> {
    const d = await this.getDetails(userLogin)
    return { live: d.live }
  }
}
