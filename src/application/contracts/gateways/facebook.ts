export interface GetFacebookUser {
  getUser: (params: GetFacebookUser.Input) => Promise<GetFacebookUser.Output>
}

export namespace GetFacebookUser {
  export type Input = {
    token: string
  }

  export type Output = {
    name: string
    email: string
    facebookId: string
  } | undefined
}
