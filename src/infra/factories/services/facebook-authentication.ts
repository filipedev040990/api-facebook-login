import { FacebookAuthenticationService } from '@/application/services'
import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClientAdapter } from '@/infra/http'
import { env } from '@/infra/env'
import { JwtTokenGeneratorAdapter } from '@/infra/crypto'
import { UserRepository } from '@/infra/database/repositories'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const httpClient = new AxiosHttpClientAdapter()
  const facebookApi = new FacebookApi(httpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  const userRepository = new UserRepository()
  const crypto = new JwtTokenGeneratorAdapter(env.crypto.secretKey)
  return new FacebookAuthenticationService(facebookApi, userRepository, crypto)
}
