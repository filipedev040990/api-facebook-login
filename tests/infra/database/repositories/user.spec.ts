// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '@/infra/database/entities'
import { UserRepository } from '@/infra/database/repositories'
import { makeFakeDbConnection } from '@/tests/infra/database/mocks'
import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('UserRepository', () => {
  describe('getByEmail', () => {
    let sut: UserRepository
    let userRepository: Repository<User>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDbConnection()
      backup = db.backup()

      userRepository = getRepository(User)
    })
    afterAll(async () => {
      await getConnection().close()
    })
    beforeEach(() => {
      backup.restore()
      sut = new UserRepository()
    })

    test('should return an account if email exists', async () => {
      await userRepository.save({ email: 'anyEmail@email.com' })

      const user = await sut.getByEmail({ email: 'anyEmail@email.com' })

      expect(user).toEqual({ id: '1' })
    })

    test('should return undefined if email does not exists', async () => {
      const user = await sut.getByEmail({ email: 'new@email.com' })

      expect(user).toBeUndefined()
    })
  })
})
