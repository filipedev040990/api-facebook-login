import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { mock, MockProxy } from 'jest-mock-extended'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { IUploadFile } from '@/application/contracts/gateways/file-storage'
import { ChangeProfilePicture } from '@/application/usecases'
import { GetUserById, SavePicture } from '@/application/contracts/repositories'

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let uuid: string
  let fileStorage: MockProxy<IUploadFile>
  let crypto: MockProxy<IUUIDGenerator>
  let userRepository: MockProxy<SavePicture & GetUserById>
  let sut: IChangeProfilePicture

  beforeAll(() => {
    file = Buffer.from('anyBuffer')
    uuid = 'any_unique_id'
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('anyUrl')
    crypto = mock()
    userRepository = mock()
    userRepository.getById.mockResolvedValue({ name: 'Ze das Couves' })
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = new ChangeProfilePicture(fileStorage, crypto, userRepository)
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

  test('should call UserRepository.savePicture once and with correct input', async () => {
    await sut.execute({ id: 'anyId', file })

    expect(userRepository.savePictureUrl).toHaveBeenCalledTimes(1)
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith({ pictureUrl: 'anyUrl', initials: undefined })
  })

  test('should call UserRepository.savePicture once and with correct input when file is undefined', async () => {
    await sut.execute({ id: 'anyId', file: undefined })

    expect(userRepository.savePictureUrl).toHaveBeenCalledTimes(1)
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'ZC' })
  })

  test('should call UserRepository.savePicture once and with correct input', async () => {
    userRepository.getById.mockResolvedValue({ name: 'ZE' })
    await sut.execute({ id: 'anyId', file: undefined })

    expect(userRepository.savePictureUrl).toHaveBeenCalledTimes(1)
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'ZE' })
  })

  test('should call UserRepository.savePicture once and with correct input', async () => {
    userRepository.getById.mockResolvedValue({ name: 'Z' })
    await sut.execute({ id: 'anyId', file: undefined })

    expect(userRepository.savePictureUrl).toHaveBeenCalledTimes(1)
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'Z' })
  })

  test('should call UserRepository.savePicture once and with correct input', async () => {
    userRepository.getById.mockResolvedValue({ name: undefined })
    await sut.execute({ id: 'anyId', file: undefined })

    expect(userRepository.savePictureUrl).toHaveBeenCalledTimes(1)
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
  })

  test('should call UserRepository.getById once and with correct input when file is undefined', async () => {
    await sut.execute({ id: 'anyId', file: undefined })

    expect(userRepository.getById).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledWith({ id: 'anyId' })
  })

  test('should not call UserRepository.getById if file is provided', async () => {
    await sut.execute({ id: 'anyId', file })

    expect(userRepository.getById).not.toHaveBeenCalled()
  })
})
