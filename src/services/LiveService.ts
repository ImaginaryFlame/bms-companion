/**
 * LiveService: intégration Twitch (Helix)
 * Implémente l'authent OAuth client_credentials et la récupération d'infos live.
 * ATTENTION: Ne pas exposer le client_secret en production. Préférez un proxy backend.
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

const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const TWITCH_API = 'https://api.twitch.tv/helix'

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

export class LiveService {
  static async getAccessToken(): Promise<string> {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID as string | undefined
    const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET as string | undefined
    if (!clientId || !clientSecret) {
      throw new Error('VITE_TWITCH_CLIENT_ID/SECRET manquants. Configurez .env')
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

  static async getUser(accessToken: string, login: string) {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID as string
    const data = await fetchJson(`${TWITCH_API}/users?login=${encodeURIComponent(login)}`, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    const user = data.data?.[0]
    if (!user) throw new Error('Streamer introuvable')
    return user as { id: string; login: string; display_name: string; profile_image_url: string }
  }

  static async getStreams(accessToken: string, userId: string) {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID as string
    const data = await fetchJson(`${TWITCH_API}/streams?user_id=${encodeURIComponent(userId)}`, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    return data.data as Array<{ id: string; title: string; started_at: string; thumbnail_url: string }>
  }

  static async getVideosLast30Days(accessToken: string, userId: string) {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID as string
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    const url = `${TWITCH_API}/videos?user_id=${encodeURIComponent(userId)}&type=archive&first=100&started_at=${startDate.toISOString()}&ended_at=${endDate.toISOString()}`
    const data = await fetchJson(url, {
      headers: { 'Client-ID': clientId, Authorization: `Bearer ${accessToken}` },
    })
    return data.data as Array<{ created_at: string; duration: string }>
  }

  static async getDetails(userLogin: string): Promise<LiveDetails> {
    // NOTE: En production, remplacez par un endpoint backend qui gère token + cache
    const token = await this.getAccessToken()
    const user = await this.getUser(token, userLogin)

    const streams = await this.getStreams(token, user.id)
    const stream = streams?.[0]
    const live = !!stream

    let streamThumbnail: string | undefined
    if (stream?.thumbnail_url) {
      streamThumbnail = stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360')
    }

    const videos = await this.getVideosLast30Days(token, user.id)
    let lastStreamAt: string | undefined
    let monthlyTotalMinutes = 0
    if (videos && videos.length) {
      lastStreamAt = videos[0]?.created_at
      for (const v of videos) monthlyTotalMinutes += parseDurationToMinutes(v.duration || '0h0m0s')
    }
    const monthlyStreamTime: MonthlyTime | undefined = {
      hours: Math.floor(monthlyTotalMinutes / 60),
      minutes: Math.floor(monthlyTotalMinutes % 60),
    }

    return {
      live,
      title: stream?.title,
      startedAt: stream?.started_at,
      streamer: { id: user.id, login: user.login, displayName: user.display_name, avatarUrl: user.profile_image_url },
      streamUrl: `https://twitch.tv/${user.login}`,
      streamThumbnail,
      lastStreamAt,
      monthlyStreamTime,
    }
  }

  static async isLive(userLogin: string): Promise<{ live: boolean }> {
    const d = await this.getDetails(userLogin)
    return { live: d.live }
  }
}
