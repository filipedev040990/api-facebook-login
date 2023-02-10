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
    const userData = await this.facebookApi.getUser({ token: params.token })
    if (userData) {
      const userExists = await this.userRepository.getByEmail({ email: userData.email })
      if (userExists?.name) {
        await this.userRepository.updateWithFacebook({
          id: userExists.id,
          name: userExists.name,
          facebookId: userData.facebookId
        })
      } else {
        await this.userRepository.createFromFacebook(userData)
      }
    }

    return new AuthenticationError()
  }
}
