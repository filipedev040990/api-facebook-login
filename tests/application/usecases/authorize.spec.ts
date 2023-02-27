import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (input: TokenValidator.Input) => Promise<void>
}

namespace TokenValidator {
  export type Input = {token: string}
}

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async execute (input: TokenValidator.Input): Promise<void> {
    await this.crypto.validateToken(input)
  }
}

describe('Authorize', () => {
  let token: string
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
  })

  beforeEach(() => {
    sut = new Authorize(crypto)
  })

  test('should call TokenValidator with correct token', async () => {
    await sut.execute({ token })

    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
  })
})
