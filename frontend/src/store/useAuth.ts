import { create } from 'zustand'
import api from '../utils/api'

type User = {
  id: string
  email: string
}

type State = {
  user: User | null
}

type Action = {
  fetchUser: () => Promise<void>
  logout: () => void
}

const useAuth = create<State & Action>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data })
    } catch (error) {
      console.log(error)
      set({ user: null })
    }
  },
  logout: () => set({ user: null })
}))

export default useAuth
