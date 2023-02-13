import { mock } from 'jest-mock-extended'
import { HttpGetClient } from '@/infra/http'
import { FacebookApi } from '@/infra/apis'

describe('FacebookApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  const httpClient = mock<HttpGetClient>()

  let sut: FacebookApi

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)

    httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' })
  })

  test('should get app token', async () => {
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

  test('should gets debug token', async () => {
    await sut.getUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
