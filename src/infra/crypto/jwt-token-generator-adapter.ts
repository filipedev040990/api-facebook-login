import { TokenGenerator } from '@/application/contracts/crypto/token'
import { sign } from 'jsonwebtoken'

type Input = TokenGenerator.Input
type Output = TokenGenerator.Output
export class JwtTokenGeneratorAdapter implements TokenGenerator {
  constructor (private readonly secretKey: string) {}
  async generateToken ({ key, expirationInMs }: Input): Promise<Output> {
    return sign({ key }, this.secretKey, { expiresIn: expirationInMs })
  }
}
