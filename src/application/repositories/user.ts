export interface GetUserRepository {
  getByEmail: (input: GetUserRepository.Input) => Promise<GetUserRepository.Output>
}

export namespace GetUserRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    name: string
    email: string
    facebookId: string
  }
}

export interface CreateUserFromFacebookRepository {
  createFromFacebook: (input: CreateUserFromFacebookRepository.Input) => Promise<CreateUserFromFacebookRepository.Output>
}

export namespace CreateUserFromFacebookRepository {
  export type Input = {
    name: string
    email: string
    facebookId: string
  }

  export type Output = undefined
}
