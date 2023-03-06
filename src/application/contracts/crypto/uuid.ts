export interface IUUIDGenerator {
  uuid: (input: IUUIDGenerator.Input) => string
}

namespace IUUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}
