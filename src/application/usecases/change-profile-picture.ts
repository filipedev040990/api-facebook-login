import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { SavePicture } from '@/application/contracts/repositories'

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator,
    private readonly userRepository: SavePicture
  ) {}

  async execute ({ file, id }: IChangeProfilePicture.Input): Promise<void> {
    if (file) {
      const pictureUrl = await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: id }) })
      await this.userRepository.savePictureUrl({ pictureUrl })
    }
  }
}
