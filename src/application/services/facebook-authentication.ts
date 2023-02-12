import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { SaveUserFromFacebookRepository, GetUserRepository } from '@/application/repositories'
import { FacebookUserEntity } from '@/domain/entities/facebook-user'
import { TokenGenerator } from '../crypto/token'

export class FacebookAuthenticationService {
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
      this.crypto.generateToken({ key: userId.id })
    }

    return new AuthenticationError()
  }
}
