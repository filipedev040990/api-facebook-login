import { AuthenticationError, MissingParamError, ServerError } from '@/shared/errors'
import { FacebookAuthentication } from '@/domain/features'
import { badRequest, serverError, successRequest, unauthorized } from '@/shared/helpers/http'
import { HttpRequest, HttpResponse } from '@/shared/types/http'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken } from '@/domain/entities'

class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      if (!input.body?.token) {
        return badRequest(new MissingParamError('token'))
      }

      const response = await this.facebookAuthenticationService.execute({ token: input.body.token })

      if (response instanceof AuthenticationError) {
        return unauthorized(new AuthenticationError())
      }

      return successRequest(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthenticationServiceStub: MockProxy<FacebookAuthentication>
  let httpRequest: HttpRequest

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
    httpRequest.body.token = null
    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 400,
      body: new MissingParamError('token')
    })
  })

  test('should return 400 if token is undefined', async () => {
    const response = await sut.execute({ })

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
      body: 'accessToken'
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
})
