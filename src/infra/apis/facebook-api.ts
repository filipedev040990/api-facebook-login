import { GetFacebookUser } from '@/application/contracts/gateways'
import { HttpGetClient } from '@/application/contracts/http/http-client'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

type Input = GetFacebookUser.Input
type Output = GetFacebookUser.Output

export class FacebookApi implements GetFacebookUser {
  private readonly urlBase = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async getUser ({ token }: Input): Promise<Output> {
    return this.getUserInfo(token)
      .then(({ id, email, name }) => ({ facebookId: id, email, name }))
      .catch(() => undefined)
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.urlBase}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.urlBase}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.urlBase}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
