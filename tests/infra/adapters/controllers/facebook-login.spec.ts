import { AuthenticationError } from '@/application/shared/errors'
import { FacebookAuthentication } from '@/domain/contracts'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController, Input } from '@/infra/adapters/controllers'
import { RequiredStringValidator } from '@/infra/adapters/validation'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthenticationUseCaseStub: MockProxy<FacebookAuthentication>
  let httpRequest: Input

  beforeAll(() => {
    facebookAuthenticationUseCaseStub = mock()
    facebookAuthenticationUseCaseStub.execute.mockResolvedValue({ accessToken: 'accessToken' })
    sut = new FacebookLoginController(facebookAuthenticationUseCaseStub)
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

  test('should call FacebookAuthenticationUseCase once and with correct values', async () => {
    await sut.execute(httpRequest)

    expect(facebookAuthenticationUseCaseStub.execute).toHaveBeenCalledWith({ token: 'token' })
  })

  test('should return 401 if authentication fails', async () => {
    facebookAuthenticationUseCaseStub.execute.mockImplementationOnce(() => {
      throw new AuthenticationError()
    })

    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 401,
      body: new AuthenticationError()
    })
  })

  test('should throws if FacebookAuthenticationUseCase throws', async () => {
    facebookAuthenticationUseCaseStub.execute.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.execute(httpRequest)

    expect(response).toEqual({
      statusCode: 500,
      body: new Error('Internal server error')
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
