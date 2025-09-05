import { create } from 'zustand'

type Topics = {
  events: boolean
  news: boolean
  lives: boolean
  hasJoel: boolean
}

type State = {
  unread: number
  topics: Topics
}

type Actions = {
  enqueue: (count?: number) => void
  markAllRead: () => void
  toggleTopic: (key: keyof Topics) => void
}

const initialTopics: Topics = {
  events: true,
  news: false,
  lives: true,
  hasJoel: true,
}

export const useNotificationsStore = create<State & Actions>((set) => ({
  unread: 0,
  topics: initialTopics,
  enqueue: (count = 1) => set(s => ({ unread: s.unread + count })),
  markAllRead: () => set({ unread: 0 }),
  toggleTopic: (key) => set(s => ({ topics: { ...s.topics, [key]: !s.topics[key] } })),
}))
