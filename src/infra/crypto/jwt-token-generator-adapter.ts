import { TokenGenerator } from '@/application/contracts/crypto/token'
import { sign } from 'jsonwebtoken'

export class JwtTokenGeneratorAdapter implements TokenGenerator {
  constructor (private readonly secretKey: string) {}
  async generateToken (input: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    return sign({ key: input.key }, this.secretKey, { expiresIn: input.expirationInMs })
  }
}
