import { GetFacebookUserApi } from '@/application/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (private readonly getFacebookUser: GetFacebookUserApi) {}

  async execute (params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
    await this.getFacebookUser.getUser({ token: params.token })
    return new AuthenticationError()
  }
}
