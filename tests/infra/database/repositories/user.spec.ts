// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '@/infra/database/entities'
import { UserRepository } from '@/infra/database/repositories'
import { makeFakeDbConnection } from '@/tests/infra/database/mocks'
import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('UserRepository', () => {
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
  describe('getByEmail', () => {
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

  describe('saveWithFacebook', () => {
    test('should create an account if email is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'anyEmail@email.com',
        name: 'anyName',
        facebookId: 'anyFacebookId'
      })

      const user = await userRepository.findOne({ email: 'anyEmail@email.com' })

      expect(user?.id).toBe(1)
    })

    test('should update account if email is defined', async () => {
      await userRepository.save({
        email: 'anyEmail@email.com',
        name: 'anyName',
        facebookId: 'anyFacebookId'
      })

      await sut.saveWithFacebook({
        id: '1',
        email: 'newEmail@email.com',
        name: 'newName',
        facebookId: 'newFacebookId'
      })

      const user = await userRepository.findOne({ email: 'anyEmail@email.com' })

      expect(user).toEqual({
        id: 1,
        email: 'anyEmail@email.com',
        name: 'newName',
        facebookId: 'newFacebookId'
      })
    })
  })
})
