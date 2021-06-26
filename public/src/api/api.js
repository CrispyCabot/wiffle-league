import axios from 'axios'

const local = 'http://localhost:3000'
const prod = 'https://agile-tor-70423.herokuapp.com'

let httpClient = axios.create({
  baseURL: window.location.hostname === 'localhost' ? local : prod,
  withCredentials: true,
  headers: {
    'content-type': 'application/json'
  },
  crossDomain: true
})

export default httpClient