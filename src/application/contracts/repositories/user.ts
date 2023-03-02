export interface GetUser {
  getByEmail: (input: GetUser.Input) => Promise<GetUser.Output>
}

export namespace GetUser {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveUserFromFacebook {
  saveWithFacebook: (input: SaveUserFromFacebook.Input) => Promise<SaveUserFromFacebook.Output>
}

export namespace SaveUserFromFacebook {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = {
    id: string
  }
}
