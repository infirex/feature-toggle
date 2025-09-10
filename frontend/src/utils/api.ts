import axios from 'axios'
import useAuth from '../store/useAuth'

const api = axios.create({
  baseURL: 'http://localhost:3050/api' // this should be environment variable
})

// Request interceptor
api.interceptors.request.use(
  (request) => {
    const { accessToken } = useAuth.getState()
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
      // request.headers['x-api-key'] = process.env.TENANT_API_KEY 
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
