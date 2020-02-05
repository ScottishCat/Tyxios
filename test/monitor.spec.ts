import tyxios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()

    tyxios('/foo', { onDownloadProgress: progressSpy })

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })
      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()

    tyxios('/foo', { onUploadProgress: progressSpy })

    return getAjaxRequest().then(request => {
      // Jasmine AJAX doesn't not support upload events, skip this test
      // expect(progressSpy).toHaveBeenCalled()
    })
  })

})