export interface GetFacebookUserApi {
  getUser: (params: GetFacebookUserApi.Input) => Promise<GetFacebookUserApi.Output>
}

export namespace GetFacebookUserApi {
  export type Input = {
    token: string
  }

  export type Output = {
    name: string
    email: string
    facebookId: string
  } | undefined
}
