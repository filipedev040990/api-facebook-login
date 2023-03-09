import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'

import { v4 } from 'uuid'
import { mocked } from 'ts-jest/utils'

jest.mock('uuid')

export class UUIDHandler {
  uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

describe('UUIDHandler', () => {
  test('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'anyKey' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  test('should return correct value', () => {
    mocked(v4).mockReturnValueOnce('anyUUID')
    const sut = new UUIDHandler()

    const uuid = sut.uuid({ key: 'anyKey' })

    expect(uuid).toBe('anyKey_anyUUID')
  })
})
