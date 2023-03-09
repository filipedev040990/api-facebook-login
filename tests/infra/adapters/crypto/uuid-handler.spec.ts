import { UUIDHandler } from '@/infra/adapters/crypto'

import { v4 } from 'uuid'
import { mocked } from 'ts-jest/utils'

jest.mock('uuid')

describe('UUIDHandler', () => {
  let sut: UUIDHandler

  beforeAll(() => {
    mocked(v4).mockReturnValue('anyUUID')
  })
  beforeEach(() => {
    sut = new UUIDHandler()
  })
  test('should call uuid.v4', () => {
    sut.uuid({ key: 'anyKey' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  test('should return correct value', () => {
    const uuid = sut.uuid({ key: 'anyKey' })

    expect(uuid).toBe('anyKey_anyUUID')
  })
})
