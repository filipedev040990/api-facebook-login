import { TokenGenerator } from '@/application/contracts/crypto/token'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenAdapter implements TokenGenerator {
  constructor (private readonly secretKey: string) {}
  async generateToken ({ key, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    return sign({ key }, this.secretKey, { expiresIn: expirationInMs })
  }

  async validateToken ({ token, secretKey }: any): Promise<void> {
    verify(token, secretKey)
  }
}
