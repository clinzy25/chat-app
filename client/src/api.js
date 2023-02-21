import axios from 'axios'

export const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.chat01.link'
    : 'http://localhost:8080'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
