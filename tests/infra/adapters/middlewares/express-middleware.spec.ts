import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { expressAdapterMiddleware } from '@/infra/adapters/middlewares/express-middleware-adapter'
import { AuthenticationMiddleware } from '@/infra/adapters/middlewares/authentication'

describe('expressAdapterMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<AuthenticationMiddleware>
  let sut: RequestHandler

  beforeEach(() => {
    req = getMockReq({ headers: { authorization: 'any_token' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock()
    middleware.execute.mockResolvedValue({
      statusCode: 200,
      body: { userId: 'anyUserId' }
    })
    sut = expressAdapterMiddleware(middleware)
  })

  test('should call execute with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.execute).toHaveBeenCalledTimes(1)
    expect(middleware.execute).toHaveBeenCalledWith(req.headers)
  })
})
