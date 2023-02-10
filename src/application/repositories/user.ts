export interface GetUserRepository {
  getByEmail: (input: GetUserRepository.Input) => Promise<GetUserRepository.Output>
}

export namespace GetUserRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveUserFromFacebookRepository {
  saveWithFacebook: (input: SaveUserFromFacebookRepository.Input) => Promise<SaveUserFromFacebookRepository.Output>
}

export namespace SaveUserFromFacebookRepository {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = undefined
}
