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
    expect(controller.execute).toHaveBeenCalledWith({ body: { any: 'any' } })
  })
})
