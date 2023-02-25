import { AuthenticationError } from '@/application/shared/errors'
import { FacebookAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken } from '@/domain/entities'
import { FacebookLoginController, Input } from '@/adapters/controllers'
import { RequiredStringValidator } from '@/adapters/validation'

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

  test('should build Validators correctly', async () => {
    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual([
      new RequiredStringValidator('token', 'token')
    ])
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
})
