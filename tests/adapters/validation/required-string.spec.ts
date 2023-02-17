import { MissingParamError } from '@/shared/errors'

export class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  execute (): Error | undefined {
    return new MissingParamError('any_filed')
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
})
