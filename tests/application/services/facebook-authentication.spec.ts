import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserRepository, SaveUserFromFacebookRepository } from '@/application/repositories'

const userData = {
  name: 'Any Facebook Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let token: string
let facebookApi: MockProxy<GetFacebookUserApi>
let sut: FacebookAuthenticationService
let userRepository: MockProxy<GetUserRepository & SaveUserFromFacebookRepository>

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    facebookApi = mock()
    facebookApi.getUser.mockResolvedValue(userData)

    userRepository = mock()
    userRepository.getByEmail.mockResolvedValue(undefined)

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

  test('should save a new user', async () => {
    await sut.execute({ token })
    expect(userRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'Any Facebook Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })

  test('should not update a user name', async () => {
    userRepository.getByEmail.mockResolvedValueOnce({
      id: 'anyID',
      name: 'Any Name'
    })
    await sut.execute({ token })
    expect(userRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'anyID',
      name: 'Any Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })

  test('should update user name', async () => {
    userRepository.getByEmail.mockResolvedValueOnce({
      id: 'anyID'
    })
    await sut.execute({ token })
    expect(userRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'anyID',
      name: 'Any Facebook Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })
})
