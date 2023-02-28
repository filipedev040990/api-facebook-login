import { HttpResponse } from '@/application/shared/types'
import { forbidden } from '@/application/shared/helpers/http'
import { ForbiddenError } from '@/application/shared/errors'
import { Authorize } from '@/application/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredStringValidator } from '@/infra/adapters/validation'

export type Input = { authorization: string }
export type Output = Error

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}
  async execute ({ authorization }: Input): Promise<HttpResponse<Output> | undefined> {
    const error = new RequiredStringValidator(authorization, 'authorization').execute()
    if (error) {
      return forbidden()
    }

    await this.authorize.execute({ token: authorization })
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let forbidenError: HttpResponse
  let authorize: MockProxy<Authorize>

  beforeAll(() => {
    authorize = mock()
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
})
