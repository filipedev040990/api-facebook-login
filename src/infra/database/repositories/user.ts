import { GetUser, SavePictureUrl, SaveUserFromFacebook } from '@/application/contracts/repositories'
import { User } from '@/infra/database/entities'
import { getRepository } from 'typeorm'

export class UserRepository implements GetUser, SaveUserFromFacebook, SavePictureUrl {
  async getByEmail ({ email }: GetUser.Input): Promise<GetUser.Output> {
    const repository = getRepository(User)
    const user = await repository.findOne({ email })
    if (user) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveUserFromFacebook.Input): Promise<SaveUserFromFacebook.Output> {
    const repository = getRepository(User)
    let resultId: string

    if (!id) {
      const user = await repository.save({ name, email, facebookId })
      resultId = user.id.toString()
    } else {
      resultId = id
      await repository.update({ id: +id }, { name, facebookId })
    }

    return { id: resultId }
  }

  async savePictureUrl ({ id, pictureUrl, initials }: SavePictureUrl.Input): Promise<void> {
    const repository = getRepository(User)
    await repository.update({ id: +id }, { pictureUrl, initials })
  }
}
