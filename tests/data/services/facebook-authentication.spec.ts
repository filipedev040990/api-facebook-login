import { FacebookAuthenticationService } from '@/data/services'
import { GetFacebookUserApi } from '@/data/contracts/apis'

class GetFacebookUserApiSpy implements GetFacebookUserApi {
  accessToken?: string
  async getUser (params: GetFacebookUserApi.Input): Promise<GetFacebookUserApi.Output> {
    this.accessToken = params.accessToken
    return undefined
  }
}

describe('FacebookAuthenticationService', () => {
  test('should call GetFacebookUserApi with correct params', async () => {
    const getFacebookUserApi = new GetFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(getFacebookUserApi)

    await sut.execute({ accessToken: 'any_token' })

    expect(getFacebookUserApi.accessToken).toBe('any_token')
  })
})
