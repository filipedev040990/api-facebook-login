import { mock, MockProxy } from 'jest-mock-extended'
import { HttpGetClient } from '@/infra/http'
import { FacebookApi } from '@/infra/apis'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let httpClient: MockProxy<HttpGetClient>
  let sut: FacebookApi

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_facebook_id' } })
      .mockResolvedValueOnce({ id: 'any_facebook_id', email: 'any_facebook_email', name: 'any_facebook_name' })

    sut = new FacebookApi(httpClient, clientId, clientSecret)
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

  test('should gets user info', async () => {
    await sut.getUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_facebook_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  test('should return facebook user info', async () => {
    const response = await sut.getUser({ token: 'any_client_token' })

    expect(response).toEqual({
      facebookId: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name'
    })
  })

  test('should return undefined if HttpClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValue(new Error('facebook_error'))

    const response = await sut.getUser({ token: 'invalid_token' })

    expect(response).toBeUndefined()
  })
})
