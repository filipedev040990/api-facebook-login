import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { CreateUserFromFacebookRepository, GetUserRepository, UpdateUserWithFacebookRepository } from '@/application/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: GetFacebookUserApi,
    private readonly userRepository: GetUserRepository & CreateUserFromFacebookRepository & UpdateUserWithFacebookRepository
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const facebookData = await this.facebookApi.getUser({ token: params.token })
    if (facebookData) {
      const userExists = await this.userRepository.getByEmail({ email: facebookData.email })
      if (userExists) {
        await this.userRepository.updateWithFacebook({
          id: userExists.id,
          name: userExists.name ?? facebookData.name,
          facebookId: facebookData.facebookId
        })
      } else {
        await this.userRepository.createFromFacebook(facebookData)
      }
    }

    return new AuthenticationError()
  }
}
