import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError, MissingParamError } from '@/shared/errors'
import { badRequest, serverError, successRequest, unauthorized } from '@/shared/helpers/http'
import { HttpResponse } from '@/shared/types'

export type HttpRequest = {
  body: {
    token: string | undefined | null
  }
}

type Output = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: HttpRequest): Promise<HttpResponse<Output>> {
    try {
      if (!input.body?.token) {
        return badRequest(new MissingParamError('token'))
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
}
