import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Home, Login, Register, Tasks } from './pages'
import useAuth from './store/useAuth'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { fetchUser, user } = useAuth()

  useEffect(() => {
    if (user) return
    fetchUser()
  }, [fetchUser, user])

  return (
    <BrowserRouter>
      <main className="h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<Tasks />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
