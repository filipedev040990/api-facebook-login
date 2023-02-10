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
let getFacebookUserApi: MockProxy<GetFacebookUserApi>
let sut: FacebookAuthenticationService
let getUserRepository: MockProxy<GetUserRepository>
let createUserFromFacebookRepository: MockProxy<CreateUserFromFacebookRepository>

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    getFacebookUserApi = mock()
    getFacebookUserApi.getUser.mockResolvedValue(userData)

    getUserRepository = mock()

    createUserFromFacebookRepository = mock()

    sut = new FacebookAuthenticationService(getFacebookUserApi, getUserRepository, createUserFromFacebookRepository)
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
    expect(getUserRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(getUserRepository.getByEmail).toHaveBeenCalledWith({ email: 'anyEmail@email.com' })
  })

  test('should call CreateUserRepository.update with correct values when GetFacebookUserApi returns undefined', async () => {
    getUserRepository.getByEmail.mockResolvedValueOnce(undefined)
    await sut.execute({ token })
    expect(createUserFromFacebookRepository.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(createUserFromFacebookRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'Any Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })
})
