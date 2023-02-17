import { HttpResponse } from '@/shared/types/http'

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
