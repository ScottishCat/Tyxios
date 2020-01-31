import tyxios from '../../src/index'

tyxios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

tyxios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

tyxios.get('/extend/get')

tyxios.options('/extend/options')

tyxios.delete('/extend/delete')

tyxios.head('/extend/head')

tyxios.post('/extend/post', { msg: 'post' })

tyxios.put('/extend/put', { msg: 'put' })

tyxios.patch('/extend/patch', { msg: 'patch' })