import { RequiredStringValidator, ValidationBuilder } from '@/infra/adapters/validation'

describe('ValidatoinBuilder', () => {
  test('should return RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_name' }).required().build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
