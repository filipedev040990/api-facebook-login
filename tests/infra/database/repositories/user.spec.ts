import { GetUserRepository } from '@/application/contracts/repositories'
import { newDb } from 'pg-mem'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm'

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
  test('should return an account if email exists', async () => {
    const db = newDb()
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [User]
    })

    // create schema
    await connection.synchronize()

    const userRepository = getRepository(User)

    await userRepository.save({ email: 'anyEmail@email.com' })

    const sut = new UserRepository()

    const user = await sut.getByEmail({ email: 'anyEmail@email.com' })

    expect(user).toEqual({ id: '1' })

    await connection.close()
  })

  test('should return undefined if email does not exists', async () => {
    const db = newDb()
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [User]
    })

    // create schema
    await connection.synchronize()

    const sut = new UserRepository()

    const user = await sut.getByEmail({ email: 'new@email.com' })

    expect(user).toBeUndefined()

    await connection.close()
  })
})
