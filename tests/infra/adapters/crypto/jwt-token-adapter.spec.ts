import { JwtTokenAdapter } from '@/infra/adapters/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenAdapter', () => {
  let sut: JwtTokenAdapter
  let fakeJwt: jest.Mocked<typeof jwt>
  let key: string
  let expirationInMs: number
  let secretKey: string

  beforeAll(() => {
    key = 'any_key'
    expirationInMs = 1800000
    secretKey = 'secret_key'
    sut = new JwtTokenAdapter('secret_key')
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  describe('sign', () => {
    beforeAll(() => {
      fakeJwt.sign.mockImplementation(() => 'any_token')
    })
    test('should call sign once and with correct values', async () => {
      await sut.generate({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secretKey, { expiresIn: expirationInMs })
    })

    test('should return a token on success', async () => {
      const accessToken = await sut.generate({ key, expirationInMs })

      expect(accessToken).toBe('any_token')
    })

    test('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.generate({ key, expirationInMs })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('verify', () => {
    let token: string

    beforeAll(() => {
      token = 'any_token'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })
    test('should call verify once and with correct values', async () => {
      await sut.validate({ token })

      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secretKey)
    })

    test('should return the key used to sign', async () => {
      const response = await sut.validate({ token })

      expect(response).toEqual({ key })
    })

    test('should rethrow if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.validate({ token })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})
