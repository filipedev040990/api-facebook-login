import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  test('should create a new instance of AccessToken', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })
})
