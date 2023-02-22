import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClientAdapter } from '@/infra/http'
import { env } from '@/infra/env'

describe('Facebook API', () => {
  test('should return a Facebook User if token is valid', async () => {
    const httpClient = new AxiosHttpClientAdapter()
    const sut = new FacebookApi(httpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const facebookUser = await sut.getUser({ token: 'EAAJT3P05pjoBAHKrnEPdsilp0q6AbwzszsFbZB23Mfp33sZCeZCZAUDEhVEQfqXBlUgI7XXvnlGZBFyUxL2KzE1zKapZCYv1WFunsEMzhrnVPrJVZB14MiHySw3jWacWlNrFm21GceSuJdlAUlLI7EnvZA4DlU711ZCruqRqSlwhmcWyZBLy26FFtZApZCZCAA9lv8aIM13wbU4OcKV2sK13N4rdbKI7fVwpj2Edzwd27lmDj5W9zFGYM6pPs' })

    expect(facebookUser).toEqual({
      facebookId: '2862342247228983',
      email: 'filipe4009@hotmail.com',
      name: 'Filipe Baptista'
    })
  })
})
