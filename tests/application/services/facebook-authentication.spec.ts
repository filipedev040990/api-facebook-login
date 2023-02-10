import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserRepository } from '@/application/repositories'

const userData = {
  name: 'Any Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let token: string
let getFacebookUserApi: MockProxy<GetFacebookUserApi>
let sut: FacebookAuthenticationService
let userRepository: GetUserRepository

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    getFacebookUserApi = mock()
    getFacebookUserApi.getUser.mockResolvedValue(userData)

    userRepository = mock()

    sut = new FacebookAuthenticationService(getFacebookUserApi, userRepository)
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

  test('should call GetUserRepository.getByEmail with correct email when GetFacebookUserApi returns data', async () => {
    await sut.execute({ token })
    expect(userRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.getByEmail).toHaveBeenCalledWith({ email: 'anyEmail@email.com' })
  })
})
