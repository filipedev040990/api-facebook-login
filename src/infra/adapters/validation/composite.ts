import { Validator } from './validator'

export class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator []) {}
  execute (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.execute()
      if (error) {
        return error
      }
    }
    return undefined
  }
}
