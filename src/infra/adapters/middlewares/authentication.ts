import { forbidden, successRequest } from '@/application/shared/helpers/http'
import { HttpResponse } from '@/application/shared/types'
import { Authorize } from '@/application/usecases'
import { RequiredStringValidator } from '@/infra/adapters/validation'

type Input = { authorization: string }
type Output = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}
  async execute ({ authorization }: Input): Promise<HttpResponse<Output>> {
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

  private validate ({ authorization }: Input): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').execute()
    return error === undefined
  }
}
