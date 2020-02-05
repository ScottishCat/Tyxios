import tyxios from '../src/index'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
    tyxios.defaults.xsrfCookieName + '=;expires=' + new Date(Date.now() - 86400000).toUTCString()
  })

  test('should not set xsrf header if cookie is null', () => {
    tyxios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[tyxios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header if cookie is set', () => {
    document.cookie = tyxios.defaults.xsrfCookieName + '=12345'

    tyxios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[tyxios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })

  test('should not set xsrf header for cross origin', () => {
    document.cookie = tyxios.defaults.xsrfCookieName + '=12345'

    tyxios('http://example.com/')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[tyxios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header for cross origin when using withCredentials', () => {
    document.cookie = tyxios.defaults.xsrfCookieName + '=12345'

    tyxios('http://example.com/', {
      withCredentials: true
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[tyxios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })
})