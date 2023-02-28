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
  test('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware()

    const response = await sut.execute({ authorization: '' })

    expect(response).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })

  test('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware()

    const response = await sut.execute({ authorization: null as any })

    expect(response).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })

  test('should return 403 if authorization is undefined', async () => {
    const sut = new AuthenticationMiddleware()

    const response = await sut.execute({ authorization: undefined as any })

    expect(response).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })
})
