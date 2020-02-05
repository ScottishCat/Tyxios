import { buildUrl, isAbsolute, concatUrl, isSameOrigin } from '../../src/utils/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildUrl('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(
        buildUrl('/foo', {
          foo: 'bar'
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(
        buildUrl('/foo', {
          foo: 'bar',
          baz: null
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      expect(
        buildUrl('/foo', {
          baz: null
        })
      ).toBe('/foo')
    })

    test('should support object params', () => {
      expect(
        buildUrl('/foo', {
          foo: {
            bar: 'baz'
          }
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })

    test('should support date params', () => {
      const date = new Date()

      expect(
        buildUrl('/foo', {
          date: date
        })
      ).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(
        buildUrl('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char params', () => {
      expect(
        buildUrl('/foo', {
          foo: '@:$, '
        })
      ).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      expect(
        buildUrl('/foo?foo=bar', {
          bar: 'baz'
        })
      ).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildUrl('/foo?foo=bar#hash', {
          query: 'baz'
        })
      ).toBe('/foo?foo=bar&query=baz')
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildUrl('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildUrl('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsolute('https://api.github.com/users')).toBeTruthy()
      expect(isAbsolute('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsolute('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsolute('123://example.com/')).toBeFalsy()
      expect(isAbsolute('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsolute('//example.com/')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsolute('/foo')).toBeFalsy()
      expect(isAbsolute('foo')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(concatUrl('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(concatUrl('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(concatUrl('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(concatUrl('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(concatUrl('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})