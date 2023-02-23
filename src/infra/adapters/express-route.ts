import { Controller } from '@/adapters/controllers'
import { HttpRequest, HttpResponse } from '@/shared/types'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const expressAdapteRouter = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse: HttpResponse = await controller.execute(httpRequest)

    const bodyResponse = httpResponse.statusCode >= 400
      ? { error: httpResponse.body.message }
      : httpResponse.body

    res.status(httpResponse.statusCode).json(bodyResponse)
  }
}
