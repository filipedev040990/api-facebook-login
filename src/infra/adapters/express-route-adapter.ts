import { HttpRequest, HttpResponse } from '@/shared/types'
import { Request, Response } from 'express'

export const adaptRoute = (controller: any) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params
    }

    const httpResponse: HttpResponse = await controller.execute(httpRequest)

    const bodyResponse = httpResponse.statusCode === 500
      ? { error: httpResponse.body.error }
      : httpResponse.body

    res.status(httpResponse.statusCode).json(bodyResponse)
  }
}
