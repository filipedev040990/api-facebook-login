import { GetUserRepository, SaveUserFromFacebookRepository } from '@/application/contracts/repositories'
import { User } from '@/infra/database/entities'
import { getRepository } from 'typeorm'

export class UserRepository implements GetUserRepository, SaveUserFromFacebookRepository {
  private readonly repository = getRepository(User)

  async getByEmail ({ email }: GetUserRepository.Input): Promise<GetUserRepository.Output> {
    const user = await this.repository.findOne({ email })
    if (user) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveUserFromFacebookRepository.Input): Promise<SaveUserFromFacebookRepository.Output> {
    let resultId: string

    if (!id) {
      const user = await this.repository.save({ name, email, facebookId })
      resultId = user.id.toString()
    } else {
      resultId = id
      await this.repository.update({ id: +id }, { name, facebookId })
    }

    return { id: resultId }
  }
}
