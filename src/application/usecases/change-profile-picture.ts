import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { GetUserById, SavePicture } from '@/application/contracts/repositories'
import { UserProfile } from '@/domain/entities'

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator,
    private readonly userRepository: SavePicture & GetUserById
  ) {}

  async execute ({ file, id }: IChangeProfilePicture.Input): Promise<void> {
    const data: { name?: string, pictureUrl?: string } = {}

    if (file) {
      data.pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: id }) })
    } else {
      data.name = (await this.userRepository.getById({ id })).name
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)

    await this.userRepository.savePictureUrl(userProfile)
  }
}
