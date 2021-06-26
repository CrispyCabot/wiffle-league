import axios from 'axios'

let httpClient = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://agile-tor-70423.herokuapp.com',
  withCredentials: true,
  headers: {
    'content-type': 'application/json'
  },
  crossDomain: true
})

export default httpClient