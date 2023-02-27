import { TokenValidator } from '@/application/contracts/crypto/token'
import { mock, MockProxy } from 'jest-mock-extended'
import { Authorize } from '@/application/usecases'

describe('Authorize', () => {
  let token: string
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue({ key: 'any_key' })
  })

  beforeEach(() => {
    sut = new Authorize(crypto)
  })

  test('should call TokenValidator with correct token', async () => {
    await sut.execute({ token })

    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
  })

  test('should return correct data on success', async () => {
    const response = await sut.execute({ token })

    expect(response).toEqual({ key: 'any_key' })
  })
})
