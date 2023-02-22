export type HttpResponse<T = any > = {
  statusCode: number
  body: T
}

export type HttpRequest = {
  params?: any
  body?: any
}
