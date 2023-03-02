import { TokenValidator } from '@/application/contracts/crypto/token'

export class Authorize {
  constructor (private readonly token: TokenValidator) {}

  async execute (input: TokenValidator.Input): Promise<TokenValidator.Output> {
    return this.token.validate(input)
  }
}
