import { Authorize } from '@/application/usecases'
import { JwtTokenAdapter } from '@/infra/adapters/crypto'
import { AuthenticationMiddleware } from '@/infra/adapters/middlewares/authentication'
import { env } from '@/infra/env'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const secretKey = env.crypto.secretKey
  const crypto = new JwtTokenAdapter(secretKey)
  const authorize = new Authorize(crypto)
  return new AuthenticationMiddleware(authorize)
}
