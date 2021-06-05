import axios from 'axios'

let httpClient = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'heroku_link_here',
  withCredentials: 'include',
  headers: {
    'content-type': 'application/json',
    'api-version': 1
  },
  crossDomain: true
})

export default httpClient