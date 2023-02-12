export interface TokenGenerator {
  generateToken: (input: TokenGenerator.Input) => TokenGenerator.Output
}

export namespace TokenGenerator {
  export type Input = {
    key: string
  }
  export type Output = {
    hash: string
  }
}
