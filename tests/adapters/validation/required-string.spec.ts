import { RequiredStringValidator } from '@/adapters/validation'
import { MissingParamError } from '@/application/shared/errors'

describe('RequiredStringValidator', () => {
  test('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_filed')

    expect(sut.execute()).toEqual(new MissingParamError('any_filed'))
  })

  test('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_filed')

    expect(sut.execute()).toEqual(new MissingParamError('any_filed'))
  })

  test('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_filed')

    expect(sut.execute()).toEqual(new MissingParamError('any_filed'))
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_filed')

    expect(sut.execute()).toBeUndefined()
  })
})
