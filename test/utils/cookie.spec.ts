import cookie from '../../src/utils/cookie'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.readCookie('foo')).toBe('baz')
  })

  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=baz'
    expect(cookie.readCookie('bar')).toBeNull()
  })
})