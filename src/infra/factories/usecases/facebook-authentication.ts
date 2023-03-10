import { FacebookAuthenticationUseCase } from '@/application/usecases'
import { FacebookApi } from '@/infra/adapters/apis'
import { AxiosHttpClientAdapter } from '@/infra/adapters/http'
import { env } from '@/infra/env'
import { JwtTokenAdapter } from '@/infra/adapters/crypto'
import { UserRepository } from '@/infra/database/repositories'

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const httpClient = new AxiosHttpClientAdapter()
  const facebookApi = new FacebookApi(httpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  const userRepository = new UserRepository()
  const crypto = new JwtTokenAdapter(env.crypto.secretKey)
  return new FacebookAuthenticationUseCase(facebookApi, userRepository, crypto)
}
