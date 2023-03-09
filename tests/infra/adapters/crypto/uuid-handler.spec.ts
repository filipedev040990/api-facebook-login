import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'
import { v4 } from 'uuid'

jest.mock('uuid')

export class UUIDHandler {
  uuid (input: IUUIDGenerator.Input): void {
    v4()
  }
}

describe('UUIDHandler', () => {
  test('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'anyKey' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
