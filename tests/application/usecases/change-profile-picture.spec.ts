import { mock } from 'jest-mock-extended'

export interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

export namespace IUploadFile {
  export type Input = { file: Buffer, key: string }
}

export interface IChangeProfilePicture {
  execute: (input: IChangeProfilePicture.Input) => Promise<void>
}

namespace IChangeProfilePicture {
  export type Input = { id: string, file: Buffer }
}

export class ChangeProfilePicture implements IChangeProfilePicture {
  constructor (private readonly fileStorage: IUploadFile) {}
  async execute (input: IChangeProfilePicture.Input): Promise<void> {
    await this.fileStorage.upload({ file: input.file, key: input.id })
  }
}

describe('ChangeProfilePicture', () => {
  test('should call UploadFile once and with correct input', async () => {
    const file = Buffer.from('anyBuffer')
    const fileStorage = mock<IUploadFile>()

    const sut = new ChangeProfilePicture(fileStorage)

    await sut.execute({ id: 'anyId', file })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'anyId' })
  })
})
