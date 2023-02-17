import { FacebookAuthentication } from '@/domain/features'
import { MissinParamError } from '@/shared/errors/missin-param'
import { badRequest, successRequest } from '@/shared/helpers/http'
import { HttpRequest, HttpResponse } from '@/shared/types/http'
import { mock, MockProxy } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    if (!input.body?.token) {
      return badRequest(new MissinParamError('token'))
    }
    await this.facebookAuthenticationService.execute({ token: input.body.token })

    return successRequest({})
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthenticationServiceStub: MockProxy<FacebookAuthentication>
  let httpRequest: HttpRequest

  beforeAll(() => {
    facebookAuthenticationServiceStub = mock()
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

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })

  test('should return 400 if token is null', async () => {
    httpRequest.body.token = null
    const response = await sut.execute(httpRequest)

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })

  test('should return 400 if token is undefined', async () => {
    const response = await sut.execute({ })

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })

  test('should call FacebookAuthenticationService once and with correct values', async () => {
    await sut.execute(httpRequest)

    expect(facebookAuthenticationServiceStub.execute).toHaveBeenCalledWith({ token: 'token' })
  })
})
