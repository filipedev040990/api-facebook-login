import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'

class GetFacebookUserApiSpy implements GetFacebookUserApi {
  accessToken?: string
  response: GetFacebookUserApi.Output

  async getUser (params: GetFacebookUserApi.Input): Promise<GetFacebookUserApi.Output> {
    this.accessToken = params.accessToken
    this.response = undefined
    return this.response
  }
}

describe('FacebookAuthenticationService', () => {
  test('should call GetFacebookUserApi with correct params', async () => {
    const getFacebookUserApi = new GetFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(getFacebookUserApi)

    await sut.execute({ accessToken: 'any_token' })

    expect(getFacebookUserApi.accessToken).toBe('any_token')
  })

  test('should return AuthenticationError when GetFacebookUserApi returns undefined', async () => {
    const getFacebookUserApi = new GetFacebookUserApiSpy()
    getFacebookUserApi.response = undefined

    const sut = new FacebookAuthenticationService(getFacebookUserApi)

    const response = await sut.execute({ accessToken: 'any_token' })

    expect(response).toEqual(new AuthenticationError())
  })
})
