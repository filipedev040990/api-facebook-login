/* eslint-disable @typescript-eslint/no-misused-promises */
import { app } from '@/infra/http/app'
import { expressAdapterMiddleware } from '@/infra/adapters/middlewares/express-middleware-adapter'
import { makeAuthenticationMiddleware } from '@/infra/factories/middlewares/authentication'
import request from 'supertest'
import { ForbiddenError } from '@/application/shared/errors'

describe('Authenticaton Middleware', () => {
  const middleware = makeAuthenticationMiddleware()
  test('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_route', expressAdapterMiddleware(middleware))

    const { statusCode, body } = await request(app).get('/fake_route')

    expect(statusCode).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
