import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'
import { AwsS3FileStorage } from '@/infra/adapters/filestorage/aws-s3'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secretAccessKey: string
  let bucket: string
  let sut: AwsS3FileStorage
  let key: string

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secretAccessKey, bucket)
  })

  beforeAll(() => {
    accessKey = 'anyAccessKey'
    secretAccessKey = 'anySecretKey'
    key = 'anyKey'
    bucket = 'anyBucket'
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

  describe('upload', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('anyBuffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
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

    test('should rethrow if putObject throws', async () => {
      const error = new Error('upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.upload({ file, key })

      await expect(promise).rejects.toThrow(error)
    })
  })
  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    test('should call putObject once and with correct input', async () => {
      await sut.delete({ key })

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key
      })
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    test('should rethrow if deleteObject throws', async () => {
      const error = new Error('upload_error')
      deleteObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.delete({ key })

      await expect(promise).rejects.toThrow(error)
    })
  })
})
