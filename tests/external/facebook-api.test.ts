import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClientAdapter } from '@/infra/adapters/http'
import { env } from '@/infra/env'

describe('Facebook API', () => {
  test('should return a Facebook User if token is valid', async () => {
    const httpClient = new AxiosHttpClientAdapter()
    const sut = new FacebookApi(httpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const facebookUser = await sut.getUser({ token: 'EAAJT3P05pjoBAMZCHtDbRchwzFhBz6Gun5m6Eh4yAq0y7jvxsDnPpjFdnZBrnZCUpiR2wHixcRqQbtp7oqQzvH512pXckPosXczy8kxMUwaipUqObWsIwvLdmD1PYMIlNLrlCj8ZAaEQb8SZAwXbEjgiRNdJzdnZAv6bCeOiaWDP5fI240vHcJmHMdiqFxaLZAK8SD0lXofs8VFyWJzCt6tSFcjVqLmYOvtc5WbvrCGIMZCqKRZBNjFJE' })

    expect(facebookUser).toEqual({
      facebookId: '2862342247228983',
      email: 'filipe4009@hotmail.com',
      name: 'Filipe Baptista'
    })
  })
})
