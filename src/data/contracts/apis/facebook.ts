export interface GetFacebookUserApi {
  getUser: (params: GetFacebookUserApi.Input) => Promise<GetFacebookUserApi.Output>
}

export namespace GetFacebookUserApi {
  export type Input = {
    accessToken: string
  }

  export type Output = undefined
}
