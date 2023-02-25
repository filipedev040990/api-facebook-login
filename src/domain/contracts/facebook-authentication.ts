import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/application/shared/errors'

export interface FacebookAuthentication {
  execute: (input: FacebookAuthentication.Input) => Promise<FacebookAuthentication.Output>
}

export namespace FacebookAuthentication {
  export type Input = {
    token: string
  }
  export type Output = AccessToken | AuthenticationError
}
