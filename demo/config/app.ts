import tyxios from '../../src/index'
import { TyxiosTransformer } from '../../src/types'
import qs from 'qs'

// tyxios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
//   console.log(res.data)
// })

// tyxios({
//     transformRequest: [(function (data) {
//         return qs.stringify(data)
//     }), ...(tyxios.defaults.transformRequest as TyxiosTransformer[])],
//     transformResponse: [...(tyxios.defaults.transformResponse as TyxiosTransformer[]), function (data) {
//         if (typeof data === 'object') {
//             data.b = 2
//         }
//         return data
//     }],
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 1
//     }
// }).then((res) => {
//     console.log(res.data)
// })

const instance = tyxios.create({
    transformRequest: [(function(data) {
      return qs.stringify(data)
    }), ...(tyxios.defaults.transformRequest as TyxiosTransformer[])],
    transformResponse: [...(tyxios.defaults.transformResponse as TyxiosTransformer[]), function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }]
  })
  
  instance({
    url: '/config/post',
    method: 'post',
    data: {
      a: 1
    }
  }).then((res) => {
    console.log(res.data)
  })