import { Controller } from '@/adapters/controllers'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { expressAdapteRouter } from '@/infra/adapters/express-route'

describe('expressAdapteRouter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.execute.mockResolvedValue({
      statusCode: 200,
      body: { any: 'any' }
    })
    sut = expressAdapteRouter(controller)
  })

  test('should call execute with correct request', async () => {
    await sut(req, res, next)

    expect(controller.execute).toHaveBeenCalledTimes(1)
    expect(controller.execute).toHaveBeenCalledWith(req)
  })

  test('should respond with 200 and correct data', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ any: 'any' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('should respond with 400 and correct error', async () => {
    controller.execute.mockResolvedValueOnce({
      statusCode: 400,
      body: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
