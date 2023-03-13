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
  let accessKey: string
  let secretAccessKey: string
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secretAccessKey)
  })

  beforeAll(() => {
    accessKey = 'anyAccessKey'
    secretAccessKey = 'anySecretKey'
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
})
