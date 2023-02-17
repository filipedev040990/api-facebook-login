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
