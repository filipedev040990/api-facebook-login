export interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<HttpGetClient.Output>
}

export namespace HttpGetClient {
  export type Input = object

  export type Output = any
}
