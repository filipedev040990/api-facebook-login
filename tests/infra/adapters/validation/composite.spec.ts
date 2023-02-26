import { mock, MockProxy } from 'jest-mock-extended'
import { Validator, ValidationComposite } from '@/infra/adapters/validation'

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator []
  let sut: ValidationComposite

  beforeAll(() => {
    validator1 = mock()
    validator1.execute.mockReturnValue(undefined)

    validator2 = mock()
    validator2.execute.mockReturnValue(undefined)
  })

  beforeEach(() => {
    validators = [validator1, validator2]
    sut = new ValidationComposite(validators)
  })

  test('should return undefined if all validators returns undefined', () => {
    expect(sut.execute()).toBeUndefined()
  })

  test('should return the first error', () => {
    validator1.execute.mockReturnValueOnce(new Error('error_validator1'))
    validator2.execute.mockReturnValueOnce(new Error('error_validator2'))

    expect(sut.execute()).toEqual(new Error('error_validator1'))
  })

  test('should return the error', () => {
    validator2.execute.mockReturnValueOnce(new Error('error_validator2'))

    expect(sut.execute()).toEqual(new Error('error_validator2'))
  })
})
