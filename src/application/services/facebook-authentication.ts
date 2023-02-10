import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { SaveUserFromFacebookRepository, GetUserRepository } from '@/application/repositories'
import { FacebookUserEntity } from '@/domain/entities/facebook-user'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: GetFacebookUserApi,
    private readonly userRepository: GetUserRepository & SaveUserFromFacebookRepository
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const facebookData = await this.facebookApi.getUser({ token: params.token })
    if (facebookData) {
      const userData = await this.userRepository.getByEmail({ email: facebookData.email })
      const facebookUser = new FacebookUserEntity(facebookData, userData)
      await this.userRepository.saveWithFacebook(facebookUser)
    }

    return new AuthenticationError()
  }
}
