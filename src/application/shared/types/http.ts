export type HttpResponse<T = any > = {
  statusCode: number
  body: T
}

export type HttpRequest<T = any> = {
  params?: T
  body?: T
  headers?: T
}
