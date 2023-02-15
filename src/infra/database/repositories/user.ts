import { GetUserRepository } from '@/application/contracts/repositories'
import { User } from '@/infra/database/entities'
import { getRepository } from 'typeorm'

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
