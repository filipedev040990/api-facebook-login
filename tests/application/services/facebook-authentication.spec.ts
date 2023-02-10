import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let token: string
  let getFacebookUserApi: MockProxy<GetFacebookUserApi>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    token = 'any_token'
    getFacebookUserApi = mock()
    sut = new FacebookAuthenticationService(getFacebookUserApi)
  })

  test('should call GetFacebookUserApi with correct params', async () => {
    await sut.execute({ token })
    expect(getFacebookUserApi.getUser).toHaveBeenCalledTimes(1)
    expect(getFacebookUserApi.getUser).toHaveBeenCalledWith({ token })
  })

  test('should return AuthenticationError when GetFacebookUserApi returns undefined', async () => {
    getFacebookUserApi.getUser.mockResolvedValueOnce(undefined)
    expect(await sut.execute({ token })).toEqual(new AuthenticationError())
  })
})
