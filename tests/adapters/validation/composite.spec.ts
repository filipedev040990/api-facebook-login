import { mock, MockProxy } from 'jest-mock-extended'

export class ValidationComposite {
  constructor (private readonly validators: Validator []) {}
  execute (): undefined {
    return undefined
  }
}

export interface Validator {
  execute: () => Error | undefined
}

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator []
  let sut: ValidationComposite

  beforeAll(() => {
    validator1 = mock()
    validator1.execute.mockReturnValueOnce(undefined)

    validator2 = mock()
    validator2.execute.mockReturnValueOnce(undefined)
  })

  beforeEach(() => {
    validators = [validator1, validator2]
    sut = new ValidationComposite(validators)
  })

  test('should return undefined if all validators returns undefined', () => {
    expect(sut.execute()).toBeUndefined()
  })
})
