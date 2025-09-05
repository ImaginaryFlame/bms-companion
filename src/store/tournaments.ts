import { create } from 'zustand'

export type Tournament = {
  id: string
  name: string
  startAt: string
}

type State = {
  tournaments: Tournament[]
  loading: boolean
}

type Actions = {
  fetchTournaments: () => Promise<void>
}

export const useTournamentsStore = create<State & Actions>((set) => ({
  tournaments: [],
  loading: false,
  fetchTournaments: async () => {
    set({ loading: true })
    try {
      // TODO: remplacez par un vrai appel API (voir TournamentsService)
      const sample: Tournament[] = [
        { id: '1', name: 'BMS Cup #1', startAt: new Date().toISOString() },
        { id: '2', name: 'BMS Cup #2', startAt: new Date(Date.now() + 86400000).toISOString() },
      ]
      await new Promise(r => setTimeout(r, 600))
      set({ tournaments: sample })
    } finally {
      set({ loading: false })
    }
  },
}))

