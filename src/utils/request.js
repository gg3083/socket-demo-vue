import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'https://3083.work', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data
      console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    if (!res) {
      return Promise.reject(new Error('Error'))
    } else {
      console.log(res)
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
