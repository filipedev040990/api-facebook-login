import { GetFacebookUserApi } from '@/application/contracts/apis'
import { HttpGetClient } from '@/infra/http'

export class FacebookApi {
  private readonly urlBase = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async getUser (params: GetFacebookUserApi.Input): Promise<void> {
    const appToken = await this.httpClient.get({
      url: `${this.urlBase}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.urlBase}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })

    await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.urlBase}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: appToken.access_token
      }
    })
  }
}
