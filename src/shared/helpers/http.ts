import { HttpResponse } from '@/shared/types/http'
import { ServerError } from '../errors'

export const badRequest = (error?: Error): HttpResponse => ({
  statusCode: 400,
  body: error ?? 'Invalid request'
})

export const successRequest = (body?: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: error ?? 'Unauthorized'
})

export const serverError = (error: unknown): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error : undefined)
})
