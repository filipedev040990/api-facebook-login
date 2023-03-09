import { IUUIDGenerator } from '@/application/contracts/crypto/uuid'

import { v4 } from 'uuid'

export class UUIDHandler implements IUUIDGenerator {
  uuid ({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}
