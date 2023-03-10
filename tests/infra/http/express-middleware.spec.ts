/* eslint-disable @typescript-eslint/no-misused-promises */
import { app } from '@/infra/http/app'
import { expressAdapterMiddleware } from '@/infra/adapters/middlewares/express-middleware-adapter'
import { makeAuthenticationMiddleware } from '@/infra/factories/middlewares/authentication'
import request from 'supertest'
import { ForbiddenError } from '@/application/shared/errors'
import { sign } from 'jsonwebtoken'
import { env } from '@/infra/env'

describe('Authenticaton Middleware', () => {
  const middleware = makeAuthenticationMiddleware()

  test('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_route', expressAdapterMiddleware(middleware))

    const { statusCode, body } = await request(app).get('/fake_route')

    expect(statusCode).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  test('should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'anyUserId' }, env.crypto.secretKey)

    app.get('/fake_route', expressAdapterMiddleware(middleware), (req, res) => {
      res.status(200).json(req.userId)
    })

    const { statusCode, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(statusCode).toBe(200)
    expect(body).toEqual('anyUserId')
  })
})
