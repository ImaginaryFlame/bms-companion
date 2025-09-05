/**
 * TournamentsService — stub API.
 * Connectez un backend (REST/GraphQL) pour gérer tournois, inscriptions, matchs.
 */

import type { Tournament } from '@/store/tournaments'

export class TournamentsService {
  static baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

  static async list(): Promise<Tournament[]> {
    // TODO: remplacer par un vrai fetch `${baseUrl}/tournaments`
    return [
      { id: '1', name: 'BMS Cup #1', startAt: new Date().toISOString() },
    ]
  }
}

