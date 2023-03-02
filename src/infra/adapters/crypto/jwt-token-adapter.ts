import { TokenGenerator, TokenValidator } from '@/application/contracts/crypto/token'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenAdapter implements TokenGenerator, TokenValidator {
  constructor (private readonly secretKey: string) {}
  async generateToken ({ key, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    return sign({ key }, this.secretKey, { expiresIn: expirationInMs })
  }

  async validateToken ({ token }: TokenValidator.Input): Promise<any> {
    const payload = verify(token, this.secretKey) as JwtPayload
    return payload
  }
}
