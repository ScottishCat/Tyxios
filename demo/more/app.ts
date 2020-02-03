import tyxios from '../../src/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {HttpError} from '../../src/types'

// document.cookie = 'a=b'

// tyxios.get('/more/get').then(res => {
//     console.log(res)
// })

// tyxios.post('http://127.0.0.1:8088/more/server2', {}, {
//     withCredentials: true
// }).then(res => {
//     console.log(res)
// })

// const instance = tyxios.create({
//     xsrfCookieName: 'XSRF-TOKEN-D',
//     xsrfHeaderName: 'X-XSRF-TOKEN-D',
//     withCredentials : true
//   })
  
//   // Chrome 隐藏了 set-cookie字段但是通过Application可以发现成功设置了Cookie
//   instance.get('/more/get').then(res => {
//     console.log(res)
//   })

// const instance = tyxios.create()

// function calculatePercentage(loaded: number, total: number) {
//   return Math.floor(loaded * 1.0) / total
// }

// function loadProgressBar() {
//   const setupStartProgress = () => {
//     instance.interceptors.request.use(config => {
//       NProgress.start()
//       return config
//     })
//   }

//   const setupUpdateProgress = () => {
//     const update = (e: ProgressEvent) => {
//       console.log(e)
//       NProgress.set(calculatePercentage(e.loaded, e.total))
//     }
//     instance.defaults.onDownloadProgress = update
//     instance.defaults.onUploadProgress = update
//   }

//   const setupStopProgress = () => {
//     instance.interceptors.response.use(response => {
//       NProgress.done()
//       return response
//     }, error => {
//       NProgress.done()
//       return Promise.reject(error)
//     })
//   }

//   setupStartProgress()
//   setupUpdateProgress()
//   setupStopProgress()
// }

// loadProgressBar()

// const downloadEl = document.getElementById('download')

// downloadEl!.addEventListener('click', e => {
//   instance.get('FILE URL')
// })

// const uploadEl = document.getElementById('upload')

// uploadEl!.addEventListener('click', e => {
//   const data = new FormData()
//   const fileEl = document.getElementById('file') as HTMLInputElement
//   if (fileEl.files) {
//     data.append('file', fileEl.files[0])

//     instance.post('/more/upload', data)
//   }
// })

// tyxios.post('/more/post', {
//     a: 1
//   }, {
//     auth: {
//       username: 'Jay',
//       password: '123456'
//     }
//   }).then(res => {
//     console.log(res)
//   })

tyxios.get('/more/304').then(res => {
    console.log(res)
  }).catch((e: HttpError) => {
    console.log(e.message)
  })
  
  tyxios.get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  }).then(res => {
    console.log(res)
  }).catch((e: HttpError) => {
    console.log(e.message)
  })