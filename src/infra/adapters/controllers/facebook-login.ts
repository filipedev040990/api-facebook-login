import { Controller } from '@/infra/adapters/controllers'
import { FacebookAuthentication } from '@/domain/contracts'
import { AuthenticationError } from '@/application/shared/errors'
import { serverError, successRequest, unauthorized } from '@/application/shared/helpers/http'
import { HttpResponse } from '@/application/shared/types'
import { ValidationBuilder, Validator } from '@/infra/adapters/validation'

export type Input = {
  body: {
    token: string
  }
}

type Output = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthenticationUseCase: FacebookAuthentication) {
    super()
  }

  async execute (input: Input): Promise<HttpResponse<Output>> {
    try {
      const accessToken = await this.facebookAuthenticationUseCase.execute({ token: input?.body.token })
      return successRequest(accessToken)
    } catch (error) {
      return error instanceof AuthenticationError
        ? unauthorized()
        : serverError(error)
    }
  }

  override buildValidators (input: Input): Validator [] {
    return [
      ...ValidationBuilder.of({ value: input.body?.token, fieldName: 'token' }).required().build()
    ]
  }
}
