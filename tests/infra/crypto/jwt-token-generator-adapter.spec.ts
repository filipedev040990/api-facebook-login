import { TokenGenerator } from '@/application/contracts/crypto/token'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

export class JwtTokenGeneratorAdapter implements TokenGenerator {
  constructor (private readonly secretKey: string) {}
  async generateToken (input: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    return jwt.sign({ key: input.key }, this.secretKey, { expiresIn: input.expirationInMs })
  }
}

describe('JwtTokenGeneratorAdapter', () => {
  let sut: JwtTokenGeneratorAdapter
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    sut = new JwtTokenGeneratorAdapter('secret_key')
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  test('should call sign once and with correct values', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1800000 })

    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'secret_key', { expiresIn: 1800000 })
  })

  test('should return a token on success', async () => {
    const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1800000 })

    expect(token).toBe('any_token')
  })

  test('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

    const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1800000 })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
