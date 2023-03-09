import { IChangeProfilePicture } from '@/domain/contracts/change-profile-picture'
import { mock, MockProxy } from 'jest-mock-extended'
import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { DeleteFile, IUploadFile } from '@/application/contracts/gateways/file-storage'
import { ChangeProfilePicture } from '@/application/usecases'
import { GetUserById, SavePicture } from '@/application/contracts/repositories'
import { mocked } from 'jest-mock'
import { UserProfile } from '@/domain/entities'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let uuid: string
  let fileStorage: MockProxy<IUploadFile & DeleteFile>
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
    expect(userRepository.savePictureUrl).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
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

  test('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'anyId',
      pictureUrl: 'anyUrl',
      initials: 'anyInitials'
    }))

    const response = await sut.execute({ id: 'anyId', file })

    expect(response).toEqual({
      pictureUrl: 'anyUrl',
      initials: 'anyInitials'
    })
  })

  test('should call DeleteFile once and with correct values when UserRepository.savePicture throws', async () => {
    userRepository.savePictureUrl.mockRejectedValueOnce(new Error())

    const promise = sut.execute({ id: 'anyId', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
    })
  })
})
