import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (input: TokenValidator.Input) => Promise<TokenValidator.Output>
}

namespace TokenValidator {
  export type Input = {token: string}
  export type Output = { key: string }
}

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async execute (input: TokenValidator.Input): Promise<TokenValidator.Output> {
    return this.crypto.validateToken(input)
  }
}

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
