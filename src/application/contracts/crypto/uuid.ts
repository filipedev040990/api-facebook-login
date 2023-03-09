export interface IUUIDGenerator {
  uuid: (input: IUUIDGenerator.Input) => string
}

export namespace IUUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}
