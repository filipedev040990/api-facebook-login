import { AccessToken } from '@/domain/types'
import { AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  execute: (input: FacebookAuthentication.Input) => Promise<FacebookAuthentication.Output>
}

export namespace FacebookAuthentication {
  export type Input = {
    accessToken: string
  }
  export type Output = AccessToken | AuthenticationError
}
