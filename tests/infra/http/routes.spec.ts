import { User } from '@/infra/database/entities'
import { makeFakeDbConnection } from '@/tests/infra/database/mocks'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'

const getUserSpy = jest.fn()

jest.mock('@/infra/apis/facebook-api', () => ({
  FacebookApi: jest.fn().mockReturnValue({
    getUser: getUserSpy
  })
}))

describe('Routes', () => {
  describe('/login/facebook', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDbConnection([User])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })

    test('should return 200 with AccessToken', async () => {
      getUserSpy.mockResolvedValueOnce({ facebookId: 'anyFacebookId', email: 'anyEmail', name: 'AnyName' })
      const { app } = await import('@/infra/http/app')
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(statusCode).toBe(200)
      expect(body).toHaveProperty('accessToken')
    })

    test('should return 401 with UnaithorizedError', async () => {
      const { app } = await import('@/infra/http/app')
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(statusCode).toBe(401)
      expect(body).toEqual({ error: 'Authentication failed' })
    })
  })
})
