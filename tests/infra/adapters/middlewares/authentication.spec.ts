import { HttpResponse } from '@/application/shared/types'
import { forbidden } from '@/application/shared/helpers/http'
import { ForbiddenError } from '@/application/shared/errors'

export type Input = { authorization: string }
export type Output = Error

export class AuthenticationMiddleware {
  async execute (input: Input): Promise<HttpResponse<Output>> {
    return forbidden()
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let forbidenError: HttpResponse

  beforeAll(() => {
    sut = new AuthenticationMiddleware()
    forbidenError = {
      statusCode: 403,
      body: new ForbiddenError()
    }
  })

  test('should return 403 if authorization is empty', async () => {
    const response = await sut.execute({ authorization: '' })

    expect(response).toEqual(forbidenError)
  })

  test('should return 403 if authorization is empty', async () => {
    const response = await sut.execute({ authorization: null as any })

    expect(response).toEqual(forbidenError)
  })

  test('should return 403 if authorization is undefined', async () => {
    const response = await sut.execute({ authorization: undefined as any })

    expect(response).toEqual(forbidenError)
  })
})
