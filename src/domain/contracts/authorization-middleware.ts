import { TokenValidator } from '@/application/contracts/crypto/token'

export interface AuthorizationMiddleware {
  execute: (input: TokenValidator.Input) => Promise<TokenValidator.Output>
}
