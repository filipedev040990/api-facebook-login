import { GetFacebookUser } from '@/application/contracts/adapters'
import { FacebookAuthentication } from '@/domain/contracts'
import { SaveUserFromFacebook, GetUser } from '@/application/contracts/repositories'
import { FacebookUserEntity, AccessToken } from '@/domain/entities'
import { TokenGenerator } from '@/application/contracts/adapters/token'
import { AuthenticationError } from '@/application/shared/errors'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly facebook: GetFacebookUser,
    private readonly userRepository: GetUser & SaveUserFromFacebook,
    private readonly token: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const facebookData = await this.facebook.getUser({ token: params.token })
    if (facebookData) {
      const userExistsData = await this.userRepository.getByEmail({ email: facebookData.email })
      const facebookUser = new FacebookUserEntity(facebookData, userExistsData)
      const userId = await this.userRepository.saveWithFacebook(facebookUser)
      const accessToken = await this.token.generate({ key: userId.id, expirationInMs: AccessToken.expirationInMs })
      return { accessToken }
    }

    throw new AuthenticationError()
  }
}
