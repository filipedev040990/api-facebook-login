import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { mock, MockProxy } from 'jest-mock-extended'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { ChangeProfilePicture } from '@/application/usecases'

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let uuid: string
  let crypto: MockProxy<IUUIDGenerator>
  let sut: IChangeProfilePicture

  beforeAll(() => {
    file = Buffer.from('anyBuffer')
    fileStorage = mock()
    uuid = 'any_unique_id'
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = new ChangeProfilePicture(fileStorage, crypto)
  })

  test('should call UploadFile once and with correct input', async () => {
    await sut.execute({ id: 'anyId', file })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
  })

  test('should not call UploadFile when file is not provided', async () => {
    await sut.execute({ id: 'anyId', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})
