import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserRepository, CreateUserFromFacebookRepository } from '@/application/repositories'

const userData = {
  name: 'Any Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let token: string
let facebookApi: MockProxy<GetFacebookUserApi>
let sut: FacebookAuthenticationService
let userRepository: MockProxy<GetUserRepository & CreateUserFromFacebookRepository>

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    facebookApi = mock()
    facebookApi.getUser.mockResolvedValue(userData)

    userRepository = mock()

    sut = new FacebookAuthenticationService(facebookApi, userRepository)
  })

  test('should call GetFacebookUserApi with correct params', async () => {
    await sut.execute({ token })
    expect(facebookApi.getUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.getUser).toHaveBeenCalledWith({ token })
  })

  test('should return AuthenticationError when GetFacebookUserApi returns undefined', async () => {
    facebookApi.getUser.mockResolvedValueOnce(undefined)
    expect(await sut.execute({ token })).toEqual(new AuthenticationError())
  })

  test('should call GetUserRepository.getByEmail with correct email when GetFacebookUserApi returns data', async () => {
    await sut.execute({ token })
    expect(userRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.getByEmail).toHaveBeenCalledWith({ email: 'anyEmail@email.com' })
  })

  test('should call CreateUserRepository.update with correct values when GetFacebookUserApi returns undefined', async () => {
    userRepository.getByEmail.mockResolvedValueOnce(undefined)
    await sut.execute({ token })
    expect(userRepository.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'Any Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })
})
