import { badRequest, serverError } from '@/shared/helpers/http'
import { HttpResponse } from '@/shared/types'
import { ValidationComposite, Validator } from '@/adapters/validation'

export abstract class Controller {
  abstract execute (input: any): Promise<HttpResponse>

  buildValidators (input: any): Validator [] {
    return []
  }

  async handle (input: any): Promise<HttpResponse> {
    const error = this.validate(input)
    if (error) {
      return badRequest(error)
    }

    try {
      return await this.execute(input)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (input: any): Error | undefined {
    const validators = this.buildValidators(input)
    return new ValidationComposite(validators).execute()
  }
}