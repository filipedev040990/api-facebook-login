import { config } from 'aws-sdk'

jest.mock('aws-sdk')

export class AwsS3FileStorage {
  constructor (private readonly accessKey: string, private readonly secretAccessKey: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
      }
    })
  }
}

describe('AwsS3FileStorage', () => {
  test('should config aws credentials on creation', async () => {
    const accessKey = 'anyAccessKey'
    const secretAccessKey = 'anySecretKey'

    const sut = new AwsS3FileStorage(accessKey, secretAccessKey)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledTimes(1)
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
      }
    })
  })
})
