import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { GetUserById, SavePicture } from '@/application/contracts/repositories'
import { UserProfile } from '@/domain/entities'
import { IUploadFile, DeleteFile } from '@/application/contracts/adapters/file-storage'
import { IUUIDGenerator } from '@/application/contracts/adapters/uuid'

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile & DeleteFile,
    private readonly crypto: IUUIDGenerator,
    private readonly userRepository: SavePicture & GetUserById
  ) {}

  async execute ({ file, id }: IChangeProfilePicture.Input): Promise<IChangeProfilePicture.Output> {
    const data: { name?: string, pictureUrl?: string } = {}
    const key = this.crypto.uuid({ key: id })
    if (file) {
      data.pictureUrl = await this.fileStorage.upload({ file, key })
    } else {
      data.name = (await this.userRepository.getById({ id })).name
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)

    try {
      await this.userRepository.savePictureUrl(userProfile)
    } catch (error) {
      if (file) {
        await this.fileStorage.delete({ key })
      }
      throw error
    }

    return {
      pictureUrl: userProfile.pictureUrl,
      initials: userProfile.initials
    }
  }
}
