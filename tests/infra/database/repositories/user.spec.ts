import { GetUserRepository } from '@/application/contracts/repositories'
import { IBackup, newDb } from 'pg-mem'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn, Repository } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true})
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: number
}

export class UserRepository implements GetUserRepository {
  async getByEmail (input: GetUserRepository.Input): Promise<GetUserRepository.Output> {
    const repository = getRepository(User)
    const user = await repository.findOne({ email: input.email })
    if (user) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined
      }
    }
  }
}

describe('UserRepository', () => {
  describe('getByEmail', () => {
    let sut: UserRepository
    let userRepository: Repository<User>
    let backup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [User]
      })
      await connection.synchronize()
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
