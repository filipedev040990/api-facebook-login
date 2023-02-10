export interface GetUserRepository {
  getByEmail: (input: GetUserRepository.Input) => Promise<GetUserRepository.Output>
}

export namespace GetUserRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {

  }
}
