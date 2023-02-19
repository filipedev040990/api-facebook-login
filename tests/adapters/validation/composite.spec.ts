import { mock } from 'jest-mock-extended'

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
  test('should return undefined if all validators returns undefined', () => {
    const validator1 = mock<Validator>()
    validator1.execute.mockReturnValueOnce(undefined)

    const validator2 = mock<Validator>()
    validator2.execute.mockReturnValueOnce(undefined)

    const validators: Validator [] = [validator1, validator2]

    const sut = new ValidationComposite(validators)

    expect(sut.execute()).toBeUndefined()
  })
})
