import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

type User = {
  id: string
  email: string
}

type State = {
  user: User | null
  accessToken: string | null
}

type Action = {
  setToken: (token: string | null) => void
  fetchUser: () => Promise<void>
  logout: () => void
}

const useAuth = create<State & Action>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setToken: (token) => {
        set({ accessToken: token })
      },

      fetchUser: async () => {
        try {
          const { accessToken } = get()
          if (!accessToken) {
            set({ user: null })
            return
          }

          const res = await api.get('/auth/me')

          set({ user: res.data })
        } catch (error) {
          console.log(error)
          set({ user: null, accessToken: null })
        }
      },

      logout: () => set({ user: null, accessToken: null })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken
      })
    }
  )
)

export default useAuth
