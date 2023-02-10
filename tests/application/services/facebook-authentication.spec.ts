import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserRepository, CreateUserFromFacebookRepository, UpdateUserWithFacebookRepository } from '@/application/repositories'

const userData = {
  name: 'Any Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let token: string
let facebookApi: MockProxy<GetFacebookUserApi>
let sut: FacebookAuthenticationService
let userRepository: MockProxy<GetUserRepository & CreateUserFromFacebookRepository & UpdateUserWithFacebookRepository>

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    facebookApi = mock()
    facebookApi.getUser.mockResolvedValue(userData)

    userRepository = mock()

    sut = new FacebookAuthenticationService(facebookApi, userRepository)
  })

  test('should call FacebookApi with correct params', async () => {
    await sut.execute({ token })
    expect(facebookApi.getUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.getUser).toHaveBeenCalledWith({ token })
  })

  test('should return AuthenticationError when FacebookApi returns undefined', async () => {
    facebookApi.getUser.mockResolvedValueOnce(undefined)
    expect(await sut.execute({ token })).toEqual(new AuthenticationError())
  })

  test('should call UserRepository.getByEmail with correct email when FacebookApi returns data', async () => {
    await sut.execute({ token })
    expect(userRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.getByEmail).toHaveBeenCalledWith({ email: 'anyEmail@email.com' })
  })

  test('should call UserRepository.create with correct values when FacebookApi returns undefined', async () => {
    userRepository.getByEmail.mockResolvedValueOnce(undefined)
    await sut.execute({ token })
    expect(userRepository.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'Any Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })

  test('should call UserRepository.update with correct values when FacebookApi returns undefined', async () => {
    userRepository.getByEmail.mockResolvedValueOnce({
      id: 'anyID',
      name: 'Any Name'
    })
    await sut.execute({ token })
    expect(userRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'anyID',
      name: 'Any Name',
      facebookId: 'Any Facebook Id'
    })
  })
})
