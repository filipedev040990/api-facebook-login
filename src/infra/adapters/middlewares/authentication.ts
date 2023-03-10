
import { Middleware } from '@/application/contracts/adapters/authentication'
import { forbidden, successRequest } from '@/application/shared/helpers/http'
import { HttpResponse } from '@/application/shared/types'
import { AuthorizationMiddleware } from '@/domain/contracts/authorization-middleware'
import { RequiredStringValidator } from '@/infra/adapters/validation'

export class AuthenticationMiddleware {
  constructor (private readonly authorize: AuthorizationMiddleware) {}
  async execute ({ authorization }: Middleware.Input): Promise<HttpResponse<Middleware.Output>> {
    if (!this.validate({ authorization })) {
      return forbidden()
    }

    try {
      const response = await this.authorize.execute({ token: authorization })
      return successRequest({ userId: response.key })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: Middleware.Input): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').execute()
    return error === undefined
  }
}
