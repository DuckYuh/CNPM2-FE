import axios from 'axios'

const api = axios.create({
  baseURL: 'https://crmbackend-production-fdb8.up.railway.app/',  // 🔹 baseURL từ swagger
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api