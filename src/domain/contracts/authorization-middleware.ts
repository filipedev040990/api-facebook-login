import { TokenValidator } from '@/application/contracts/adapters/token'

export interface AuthorizationMiddleware {
  execute: (input: TokenValidator.Input) => Promise<TokenValidator.Output>
}
