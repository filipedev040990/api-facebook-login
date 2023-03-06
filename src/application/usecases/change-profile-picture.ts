import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (
    private readonly fileStorage: IUploadFile,
    private readonly crypto: IUUIDGenerator
  ) {}

  async execute ({ file, id }: IChangeProfilePicture.Input): Promise<void> {
    await this.fileStorage.upload({ file, key: this.crypto.uuid({ key: id }) })
  }
}
