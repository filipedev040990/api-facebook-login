import { GetUserRepository, SaveUserFromFacebookRepository } from '@/application/contracts/repositories'
import { User } from '@/infra/database/entities'
import { getRepository } from 'typeorm'

export class UserRepository implements GetUserRepository, SaveUserFromFacebookRepository {
  private readonly repository = getRepository(User)

  async getByEmail (input: GetUserRepository.Input): Promise<GetUserRepository.Output> {
    const user = await this.repository.findOne({ email: input.email })
    if (user) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined
      }
    }
  }

  async saveWithFacebook (input: SaveUserFromFacebookRepository.Input): Promise<SaveUserFromFacebookRepository.Output> {
    let id: string

    if (!input.id) {
      const user = await this.repository.save({
        name: input.name,
        email: input.email,
        facebookId: input.facebookId
      })
      id = user.id.toString()
    } else {
      id = input.id
      await this.repository.update({
        id: +input.id
      }, {
        name: input.name,
        facebookId: input.facebookId
      })
    }

    return { id }
  }
}
