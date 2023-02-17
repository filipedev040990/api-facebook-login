import { AuthenticationError, MissingParamError, ServerError } from '@/shared/errors'
import { FacebookAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken } from '@/domain/entities'
import { FacebookLoginController, Input } from '@/adapters/controllers'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthenticationServiceStub: MockProxy<FacebookAuthentication>
  let httpRequest: Input

  beforeAll(() => {
    facebookAuthenticationServiceStub = mock()
    facebookAuthenticationServiceStub.execute.mockResolvedValue(new AccessToken('accessToken'))
    sut = new FacebookLoginController(facebookAuthenticationServiceStub)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    httpRequest = {
      body: {
        token: 'token'
      }
    }
  })

  test('should return 400 if token is empty', async () => {
    httpRequest.body.token = ''
    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamError('token')
    })
  })

  test('should return 400 if token is null', async () => {
    httpRequest.body.token = null as any
    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamError('token')
    })
  })

  test('should return 400 if token is undefined', async () => {
    httpRequest.body.token = undefined as any
    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamError('token')
    })
  })

  test('should call FacebookAuthenticationService once and with correct values', async () => {
    await sut.execute(httpRequest)

    expect(facebookAuthenticationServiceStub.execute).toHaveBeenCalledWith({ token: 'token' })
  })

  test('should return 401 if authentication fails', async () => {
    facebookAuthenticationServiceStub.execute.mockResolvedValueOnce(new AuthenticationError())

    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 401,
      body: new AuthenticationError()
    })
  })

  test('should return 200 and token if authentication succeeds', async () => {
    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 200,
      body: {
        accessToken: 'accessToken'
      }
    })
  })

  test('should return 500 if FacebookAuthenticationService throws', async () => {
    const error = new Error()
    facebookAuthenticationServiceStub.execute.mockRejectedValueOnce(error)

    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
  })

  test('should return 500 if FacebookAuthenticationService throws without error', async () => {
    facebookAuthenticationServiceStub.execute.mockRejectedValueOnce('server_error')

    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError()
    })
  })
})
