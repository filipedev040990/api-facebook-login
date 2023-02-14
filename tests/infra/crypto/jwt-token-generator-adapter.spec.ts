import { TokenGenerator } from '@/application/contracts/crypto/token'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secretKey: string) {}
  generateToken (input: TokenGenerator.Input): TokenGenerator.Output {
    return jwt.sign({ key: input.key }, this.secretKey, { expiresIn: input.expirationInMs })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    sut = new JwtTokenGenerator('secret_key')
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  test('should call sign once and with correct values', () => {
    sut.generateToken({ key: 'any_key', expirationInMs: 1800000 })

    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'secret_key', { expiresIn: 1800000 })
  })

  test('should return a token on success', () => {
    const token = sut.generateToken({ key: 'any_key', expirationInMs: 1800000 })

    expect(token).toBe('any_token')
  })
})