import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError, MissingParamError } from '@/shared/errors'
import { badRequest, serverError, successRequest, unauthorized } from '@/shared/helpers/http'
import { HttpRequest, HttpResponse } from '@/shared/types/http'

export class FacebookLoginController {
  constructor (private readonly facebookAuthenticationService: FacebookAuthentication) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      if (!input.body?.token) {
        return badRequest(new MissingParamError('token'))
      }

      const response = await this.facebookAuthenticationService.execute({ token: input.body.token })

      if (response instanceof AuthenticationError) {
        return unauthorized(new AuthenticationError())
      }

      return successRequest(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
