import { HttpResponse } from '@/application/shared/types'

export namespace Middleware {
  export type Input = { authorization: string }
  export type Output = Error | { userId: string }
}

export interface Middleware {
  execute: (input: Middleware.Input) => Promise<HttpResponse<Middleware.Output>>
}
