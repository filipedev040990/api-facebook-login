import { HttpRequest, HttpResponse } from '@/application/shared/types'
import { NextFunction, Request, Response } from 'express'
import { AuthenticationMiddleware } from './authentication'

export const expressAdapterMiddleware = (middleware: AuthenticationMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }

    const { statusCode, body }: HttpResponse = await middleware.execute(httpRequest.headers)
    if (statusCode >= 200 && statusCode <= 399) {
      req.userId = body.userId
      return next()
    }

    res.status(statusCode).json({ error: body.message })
  }
}
