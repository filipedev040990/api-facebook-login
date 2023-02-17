import { MissingParamError } from '@/shared/errors'

export class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  execute (): Error | undefined {
    if (!this.value) {
      return new MissingParamError(this.fieldName)
    }
  }
}

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
