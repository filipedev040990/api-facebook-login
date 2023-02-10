import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { GetUserRepository } from '@/application/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly getFacebookUser: GetFacebookUserApi,
    private readonly getUserRepository: GetUserRepository
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const userData = await this.getFacebookUser.getUser({ token: params.token })
    if (userData) {
      await this.getUserRepository.getByEmail({ email: userData.email })
    }

    return new AuthenticationError()
  }
}
