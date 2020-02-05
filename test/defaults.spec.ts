import tyxios, { TyxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'
import { deepMerge } from '../src/utils/universal'

describe('defaults', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform request json', () => {
    expect((tyxios.defaults.transformRequest as TyxiosTransformer[])[0]({ foo: 'bar' })).toBe('{"foo":"bar"}')
  })

  test('should do nothing to request string', () => {
    expect((tyxios.defaults.transformRequest as TyxiosTransformer[])[0]('foo=bar')).toBe('foo=bar')
  })

  test('should transform response json', () => {
    const data = (tyxios.defaults.transformResponse as TyxiosTransformer[])[0]('{"foo":"bar"}')

    expect(typeof data).toBe('object')
    expect(data.foo).toBe('bar')
  })

  test('should do nothing to response string', () => {
    expect((tyxios.defaults.transformResponse as TyxiosTransformer[])[0]('foo=bar')).toBe('foo=bar')
  })

  test('should use global defaults config', () => {
    tyxios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })

  test('should use modified defaults config', () => {
    tyxios.defaults.baseURL = 'http://example.com/'

    tyxios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/foo')
      delete tyxios.defaults.baseURL
    })
  })

  test('should use request config', () => {
    tyxios('/foo', {
      baseURL: 'http://www.example.com'
    })

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://www.example.com/foo')
    })
  })

  test('should use default config for custom instance', () => {
    const instance = tyxios.create({
      xsrfCookieName: 'CUSTOM-XSRF-TOKEN',
      xsrfHeaderName: 'X-CUSTOM-XSRF-TOKEN'
    })
    document.cookie = instance.defaults.xsrfCookieName + '=foobarbaz'

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[instance.defaults.xsrfHeaderName!]).toBe('foobarbaz')
      document.cookie =
        instance.defaults.xsrfCookieName +
        '=;expires=' +
        new Date(Date.now() - 86400000).toUTCString()
    })
  })

  test('should use GET headers', () => {
    tyxios.defaults.headers.get['X-CUSTOM-HEADER'] = 'foo'
    tyxios.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete tyxios.defaults.headers.get['X-CUSTOM-HEADER']
    })
  })

  test('should use POST headers', () => {
    tyxios.defaults.headers.post['X-CUSTOM-HEADER'] = 'foo'
    tyxios.post('/foo', {})

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete tyxios.defaults.headers.post['X-CUSTOM-HEADER']
    })
  })

  test('should use header config', () => {
    const instance = tyxios.create({
      headers: {
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
    })

    instance.get('/foo', {
      headers: {
        'X-FOO-HEADER': 'fooHeaderValue',
        'X-BAR-HEADER': 'barHeaderValue'
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders).toEqual(
        deepMerge(tyxios.defaults.headers.common, tyxios.defaults.headers.get, {
          'X-COMMON-HEADER': 'commonHeaderValue',
          'X-GET-HEADER': 'getHeaderValue',
          'X-FOO-HEADER': 'fooHeaderValue',
          'X-BAR-HEADER': 'barHeaderValue'
        })
      )
    })
  })

  test('should be used by custom instance if set before instance created', () => {
    tyxios.defaults.baseURL = 'http://example.org/'
    const instance = tyxios.create()

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.org/foo')
      delete tyxios.defaults.baseURL
    })
  })

  test('should not be used by custom instance if set after instance created', () => {
    const instance = tyxios.create()
    tyxios.defaults.baseURL = 'http://example.org/'

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })
})