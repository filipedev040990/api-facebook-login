import { IUploadFile } from '@/application/contracts/adapters/file-storage'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')

export class AwsS3FileStorage implements IUploadFile {
  constructor (accessKey: string, secretAccessKey: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
      }
    })
  }

  async upload ({ file, key }: IUploadFile.Input): Promise<IUploadFile.Output> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secretAccessKey: string
  let bucket: string
  let sut: AwsS3FileStorage
  let file: Buffer
  let key: string
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secretAccessKey, bucket)
  })

  beforeAll(() => {
    accessKey = 'anyAccessKey'
    secretAccessKey = 'anySecretKey'
    bucket = 'anyBucket'
    file = Buffer.from('anyBuffer')
    key = 'anyKey'

    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
  })

  test('should config aws credentials on creation', async () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledTimes(1)
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
      }
    })
  })

  test('should call putObject once and with correct input', async () => {
    await sut.upload({ file, key })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  test('should return imageUrl', async () => {
    const imageUrl = await sut.upload({ file, key })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  test('should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ file, key: 'any key' })

    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })
})
