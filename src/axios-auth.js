import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts'
})

export default instance
