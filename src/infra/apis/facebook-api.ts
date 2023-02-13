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
    await this.httpClient.get({
      url: `${this.urlBase}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}
