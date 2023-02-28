import { HttpResponse } from '@/application/shared/types'
import { forbidden, successRequest } from '@/application/shared/helpers/http'
import { ForbiddenError } from '@/application/shared/errors'
import { Authorize } from '@/application/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredStringValidator } from '@/infra/adapters/validation'

export type Input = { authorization: string }
export type Output = Error | { userId: string}

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}
  async execute ({ authorization }: Input): Promise<HttpResponse<Output>> {
    try {
      const error = new RequiredStringValidator(authorization, 'authorization').execute()
      if (error) {
        return forbidden()
      }

      const response = await this.authorize.execute({ token: authorization })
      return successRequest({ userId: response.key })
    } catch {
      return forbidden()
    }
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let forbidenError: HttpResponse
  let authorize: MockProxy<Authorize>

  beforeAll(() => {
    authorize = mock()
    authorize.execute.mockResolvedValue({ key: 'anyUserId' })
    sut = new AuthenticationMiddleware(authorize)
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

  test('should call authorize once and with correct values', async () => {
    await sut.execute({ authorization: 'any_token' })

    expect(authorize.execute).toHaveBeenCalledTimes(1)
    expect(authorize.execute).toHaveBeenCalledWith({ token: 'any_token' })
  })

  test('should return 403 if authorize throws', async () => {
    authorize.execute.mockRejectedValueOnce(new Error('any_error'))

    const response = await sut.execute({ authorization: 'any_token' })

    expect(response).toEqual(forbidenError)
  })

  test('should return 200 with userId on success', async () => {
    const response = await sut.execute({ authorization: 'any_token' })

    expect(response).toEqual({
      statusCode: 200,
      body: {
        userId: 'anyUserId'
      }
    })
  })
})
