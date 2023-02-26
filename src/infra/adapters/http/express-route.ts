import { Controller } from '@/infra/adapters/controllers'
import { HttpResponse } from '@/application/shared/types'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const expressAdapteRouter = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, body }: HttpResponse = await controller.execute({ ...req })

    const jsonResponse = statusCode === 200 ? body : { error: body.message }

    res.status(statusCode).json(jsonResponse)
  }
}
