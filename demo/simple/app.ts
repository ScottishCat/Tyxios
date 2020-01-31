import tyxios from '../../src/index'

tyxios({
  url: '/simple/get',
  method: 'get',
  params: {
    foo: 1,
    bar: 2
  }
});