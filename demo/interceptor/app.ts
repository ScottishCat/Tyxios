import tyxios from '../../src/index'

tyxios.interceptors.request.use(config => {
    config.headers.test += '1'
    return config
})
tyxios.interceptors.request.use(config => {
    config.headers.test += '2'
    return config
})
tyxios.interceptors.request.use(config => {
    config.headers.test += '3'
    return config
})

tyxios.interceptors.response.use(res => {
    res.data += '1'
    return res
})
let interceptor = tyxios.interceptors.response.use(res => {
    res.data += '2'
    return res
})
tyxios.interceptors.response.use(res => {
    res.data += '3'
    return res
})

tyxios.interceptors.response.eject(interceptor)

tyxios({
    url: '/interceptor/get',
    method: 'get',
    headers: {
        test: ''
    }
}).then((res) => {
    console.log(res.data)
})