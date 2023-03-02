import { FacebookAuthenticationUseCase } from '@/application/usecases'
import { GetFacebookUser } from '@/application/contracts/gateways'
import { AuthenticationError } from '@/application/shared/errors'
import { GetUser, SaveUserFromFacebook } from '@/application/contracts/repositories'
import { FacebookUserEntity } from '@/domain/entities/facebook-user'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'
import { TokenGenerator } from '../contracts/crypto/token'
import { AccessToken } from '@/domain/entities'

jest.mock('@/domain/entities/facebook-user')

const userData = {
  name: 'Any Facebook Name',
  email: 'anyEmail@email.com',
  facebookId: 'Any Facebook Id'
}

let facebookApi: MockProxy<GetFacebookUser>
let crypto: MockProxy<TokenGenerator>
let sut: FacebookAuthenticationUseCase
let userRepository: MockProxy<GetUser & SaveUserFromFacebook>
let token: string

describe('FacebookAuthenticationUseCase', () => {
  beforeAll(() => {
    token = 'any_token'

    facebookApi = mock()
    facebookApi.getUser.mockResolvedValue(userData)

    userRepository = mock()
    userRepository.getByEmail.mockResolvedValue(undefined)
    userRepository.saveWithFacebook.mockResolvedValue({ id: 'anyId' })

    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationUseCase(facebookApi, userRepository, crypto)
  })

  test('should call FacebookApi with correct params', async () => {
    await sut.execute({ token })
    expect(facebookApi.getUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.getUser).toHaveBeenCalledWith({ token })
  })

  test('should return AuthenticationError when FacebookApi returns undefined', async () => {
    facebookApi.getUser.mockResolvedValueOnce(undefined)
    await expect(sut.execute({ token })).rejects.toThrow(new AuthenticationError())
  })

  test('should call UserRepository.getByEmail with correct email when FacebookApi returns data', async () => {
    await sut.execute({ token })
    expect(userRepository.getByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.getByEmail).toHaveBeenCalledWith({ email: 'anyEmail@email.com' })
  })

  test('should call UserRepository once and with FacebookUserEntity instance', async () => {
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

  test('should call Crypto.generate with correct values', async () => {
    await sut.execute({ token })

    expect(crypto.generate).toHaveBeenCalledTimes(1)
    expect(crypto.generate).toHaveBeenCalledWith({ key: 'anyId', expirationInMs: AccessToken.expirationInMs })
  })

  test('should return an AccessToken on success', async () => {
    const accessToken = await sut.execute({ token })

    expect(accessToken).toEqual({ accessToken: 'any_generated_token' })
  })

  test('should rethrow if FacebookApi throws', async () => {
    facebookApi.getUser.mockRejectedValue(new Error())

    const response = sut.execute({ token })

    await expect(response).rejects.toThrow()
  })

  test('should rethrow if UserRepository.getByEmail throws', async () => {
    userRepository.getByEmail.mockRejectedValue(new Error())

    const response = sut.execute({ token })

    await expect(response).rejects.toThrow()
  })

  test('should rethrow if UserRepository.saveWithFacebook throws', async () => {
    userRepository.saveWithFacebook.mockRejectedValue(new Error())

    const response = sut.execute({ token })

    await expect(response).rejects.toThrow()
  })

  test('should rethrow if Crypto.generate throws', async () => {
    crypto.generate.mockRejectedValue(new Error())

    const response = sut.execute({ token })

    await expect(response).rejects.toThrow()
  })
})
