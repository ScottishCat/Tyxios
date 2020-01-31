import tyxios, { HttpError } from '../../src/index'

// 路由不正确
tyxios({
    url: '/error/getError',
    method: 'get'
}).then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
});

// 随机错误
tyxios({
    url: '/error/get',
    method: 'get'
}).then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
});

// 超时
setTimeout(() => {
    tyxios({
        url: '/error/get',
        method: 'get'
    }).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    });
}, 5000);

// 传超时时间
tyxios({
    url: '/error/timeout',
    method: 'get',
    timeout: 2000
}).then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
});

// 显示 TxiosError 类型的 Error
tyxios({
    url: '/error/timeout',
    method: 'get',
    timeout: 2000
  }).then(res => {
    console.log(res)
  }).catch((e: HttpError) => {
      console.log(e)
  });
