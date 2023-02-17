import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/shared/errors'
import { badRequest, serverError, successRequest, unauthorized } from '@/shared/helpers/http'
import { HttpResponse } from '@/shared/types'
import { RequiredStringValidator } from '../validation'

export type Input = {
  body: {
    token: string
  }
}

type Output = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: Input): Promise<HttpResponse<Output>> {
    try {
      const error = this.validate(input)
      if (error) {
        return badRequest(error)
      }
      const response = await this.facebookAuthenticationService.execute({ token: input.body.token })

      if (response instanceof AuthenticationError) {
        return unauthorized(new AuthenticationError())
      }

      return successRequest({ accessToken: response.value })
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (input: Input): Error | undefined {
    const validator = new RequiredStringValidator(input.body?.token, 'token')
    return validator.execute()
  }
}
