import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { CreateUserFromFacebookRepository, GetUserRepository } from '@/application/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly getFacebookUser: GetFacebookUserApi,
    private readonly getUserRepository: GetUserRepository,
    private readonly createUserFromFacebook: CreateUserFromFacebookRepository
  ) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    const userData = await this.getFacebookUser.getUser({ token: params.token })
    if (userData) {
      const userExists = await this.getUserRepository.getByEmail({ email: userData.email })
      if (!userExists) {
        await this.createUserFromFacebook.createFromFacebook(userData)
      }
    }

    return new AuthenticationError()
  }
}
