export interface IChangeProfilePicture {
  execute: (input: IChangeProfilePicture.Input) => Promise<void>
}

export namespace IChangeProfilePicture {
  export type Input = { id: string, file?: Buffer }
}
