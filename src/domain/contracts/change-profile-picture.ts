export interface IChangeProfilePicture {
  execute: (input: IChangeProfilePicture.Input) => Promise<IChangeProfilePicture.Output>
}

export namespace IChangeProfilePicture {
  export type Input = { id: string, file?: Buffer }
  export type Output = { pictureUrl?: string, initials?: string }
}
