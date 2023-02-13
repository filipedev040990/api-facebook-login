import { GetFacebookUserApi } from '@/application/contracts/apis'
import { mock } from 'jest-mock-extended'

class FacebookApi {
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

export interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<void>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params: {
      client_id: string
      client_secret: string
      grant_type: string
    }
  }
}

describe('FacebookApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  const httpClient = mock<HttpGetClient>()

  test('should get app token', async () => {
    const sut = new FacebookApi(httpClient, clientId, clientSecret)

    await sut.getUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
