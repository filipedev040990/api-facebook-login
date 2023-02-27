import { TokenValidator } from '@/application/contracts/crypto/token'

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async execute (input: TokenValidator.Input): Promise<TokenValidator.Output> {
    return this.crypto.validateToken(input)
  }
}
