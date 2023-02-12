import { FacebookAuthenticationService } from '@/application/services'
import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GetUserRepository, SaveUserFromFacebookRepository } from '@/application/contracts/repositories'
import { FacebookUserEntity } from '@/domain/entities/facebook-user'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'
import { TokenGenerator } from '../contracts/crypto/token'
import { AccessToken } from '@/domain/entities'

jest.mock('@/domain/entities/facebook-user')

const userData = {
  name: 'Any Facebook Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let token: string
let facebookApi: MockProxy<GetFacebookUserApi>
let crypto: MockProxy<TokenGenerator>
let sut: FacebookAuthenticationService
let userRepository: MockProxy<GetUserRepository & SaveUserFromFacebookRepository>

describe('FacebookAuthenticationService', () => {
  beforeEach(() => {
    token = 'any_token'

    facebookApi = mock()
    facebookApi.getUser.mockResolvedValue(userData)

    userRepository = mock()
    userRepository.getByEmail.mockResolvedValue(undefined)
    userRepository.saveWithFacebook.mockResolvedValue({ id: 'anyId' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')

    sut = new FacebookAuthenticationService(facebookApi, userRepository, crypto)
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

  test('should call UserRepository onde and with FacebookUserEntity instance', async () => {
    const FacebookUserEntityStub = jest.fn().mockImplementationOnce(() => ({
      name: 'Any Facebook Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    }))

    mocked(FacebookUserEntity).mockImplementationOnce(FacebookUserEntityStub)

    await sut.execute({ token })

    expect(userRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'Any Facebook Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })

  test('should call Crypto.generateToken with correct values', async () => {
    await sut.execute({ token })

    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'anyId', expirationInMs: AccessToken.expirationInMs })
  })

  test('should return an AccessToken on success', async () => {
    const accessToken = await sut.execute({ token })

    expect(accessToken).toEqual(new AccessToken('any_generated_token'))
  })
})
