import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClientAdapter } from '@/infra/http'
import { env } from '@/infra/env'

describe('Facebook API', () => {
  test('should return a Facebook User if token is valid', async () => {
    const httpClient = new AxiosHttpClientAdapter()
    const sut = new FacebookApi(httpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const facebookUser = await sut.getUser({ token: 'EAAJT3P05pjoBAARXfJ51VQilkJXHUUZAbSArACGZAYPLlkyomFJepd81LZCn4Q20CF9ZCpLNfDkQhftCibmR4BlChZB8i2i8OfU8n54qI3jB4oZB2AZCcuOoIZAYH7EEuep8LQcc5JcR2BsPDOfYVwR1KVN0JbtHoqtBcecZCHk3DU22H0qq0MauZABOgpAr4ZB45ARzYJrLZA9ZA4RLuUCKcd8cIRa2QRz0BZCZAYukFImrBzA7XYZBar4f6QIG' })

    expect(facebookUser).toEqual({
      facebookId: '2862342247228983',
      email: 'filipe4009@hotmail.com',
      name: 'Filipe Baptista'
    })
  })
})
