import axios from 'axios'

let httpClient = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'heroku_link_here',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default httpClient