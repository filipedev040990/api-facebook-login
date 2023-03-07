import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { GetUserById, SavePicture } from '@/application/contracts/repositories'

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator,
    private readonly userRepository: SavePicture & GetUserById
  ) {}

  async execute ({ file, id }: IChangeProfilePicture.Input): Promise<void> {
    let pictureUrl: string | undefined

    if (file) {
      pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: id }) })
    } else {
      await this.userRepository.getById({ id })
    }

    await this.userRepository.savePictureUrl({ pictureUrl })
  }
}
