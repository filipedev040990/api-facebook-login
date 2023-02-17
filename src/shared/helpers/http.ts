import { HttpResponse } from '@/shared/types/http'

export const badRequest = (error?: Error): HttpResponse => ({
  statusCode: 400,
  body: error ?? 'Invalid request'
})
