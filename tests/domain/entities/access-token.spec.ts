import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  test('should create a new instance of AccessToken', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  test('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
