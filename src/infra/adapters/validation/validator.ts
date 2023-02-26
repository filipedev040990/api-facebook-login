export interface Validator {
  execute: () => Error | undefined
}
