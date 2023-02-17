import { AuthenticationError, MissingParamError } from '@/shared/errors'
import { FacebookAuthentication } from '@/domain/features'
import { badRequest, successRequest, unauthorized } from '@/shared/helpers/http'
import { HttpRequest, HttpResponse } from '@/shared/types/http'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken } from '@/domain/entities'

class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    if (!input.body?.token) {
      return badRequest(new MissingParamError('token'))
    }

    const response = await this.facebookAuthenticationService.execute({ token: input.body.token })

    if (response instanceof AuthenticationError) {
      return unauthorized(new AuthenticationError())
    }

    return successRequest(response.value)
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
    httpRequest = {
      body: {
        token: 'token'
      }
    }
  })

  test('should return 400 if token is empty', async () => {
    httpRequest.body.token = ''
    const response = await sut.execute(httpRequest)

    expect(response).toEqual(badRequest(new MissingParamError('token')))
  })

  test('should return 400 if token is null', async () => {
    httpRequest.body.token = null
    const response = await sut.execute(httpRequest)

    expect(response).toEqual(badRequest(new MissingParamError('token')))
  })

  test('should return 400 if token is undefined', async () => {
    const response = await sut.execute({ })

    expect(response).toEqual(badRequest(new MissingParamError('token')))
  })

  test('should call FacebookAuthenticationService once and with correct values', async () => {
    await sut.execute(httpRequest)

    expect(facebookAuthenticationServiceStub.execute).toHaveBeenCalledWith({ token: 'token' })
  })

  test('should return 401 if authentication fails', async () => {
    facebookAuthenticationServiceStub.execute.mockResolvedValueOnce(new AuthenticationError())

    const response = await sut.execute(httpRequest)

    expect(response).toEqual(unauthorized(new AuthenticationError()))
  })

  test('should return 200 and token if authentication succeeds', async () => {
    const response = await sut.execute(httpRequest)

    expect(response).toEqual(successRequest('accessToken'))
  })
})
