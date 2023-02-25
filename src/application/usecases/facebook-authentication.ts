import { GetFacebookUserApi } from '@/application/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { SaveUserFromFacebookRepository, GetUserRepository } from '@/application/contracts/repositories'
import { FacebookUserEntity, AccessToken } from '@/domain/entities'
import { TokenGenerator } from '@/application/contracts/crypto/token'
import { AuthenticationError } from '@/application/shared/errors'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: GetFacebookUserApi,
    private readonly userRepository: GetUserRepository & SaveUserFromFacebookRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const facebookData = await this.facebookApi.getUser({ token: params.token })
    if (facebookData) {
      const userExistsData = await this.userRepository.getByEmail({ email: facebookData.email })
      const facebookUser = new FacebookUserEntity(facebookData, userExistsData)
      const userId = await this.userRepository.saveWithFacebook(facebookUser)
      const token = await this.crypto.generateToken({ key: userId.id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
