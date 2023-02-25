import { Controller } from '@/adapters/controllers'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/application/shared/errors'
import { successRequest, unauthorized } from '@/application/shared/helpers/http'
import { HttpResponse } from '@/application/shared/types'
import { ValidationBuilder, Validator } from '@/adapters/validation'

export type Input = {
  body: {
    token: string
  }
}

type Output = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {
    super()
  }

  async execute (input: Input): Promise<HttpResponse<Output>> {
    const response = await this.facebookAuthenticationService.execute({ token: input?.body.token })
    return response instanceof AuthenticationError
      ? unauthorized(new AuthenticationError())
      : successRequest({ accessToken: response.value })
  }

  override buildValidators (input: Input): Validator [] {
    return [
      ...ValidationBuilder.of({ value: input.body?.token, fieldName: 'token' }).required().build()
    ]
  }
}
