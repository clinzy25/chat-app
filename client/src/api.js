import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.chat01.link'
    : 'http://localhost:80'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
