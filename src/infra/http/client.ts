export interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<void>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params: {
      client_id: string
      client_secret: string
      grant_type: string
    }
  }
}
