import { HttpResponse } from '@/application/shared/types'
import { AuthenticationError, ForbiddenError, ServerError } from '@/application/shared/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const successRequest = <T = any>(body: T): HttpResponse<T> => ({
  statusCode: 200,
  body
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new AuthenticationError()
})

export const serverError = (error: unknown): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error : undefined)
})

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError()
})
