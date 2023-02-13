import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

export class AxiosHttpClientAdapter implements HttpGetClient {
  async get <T = any>(input: HttpGetClient.Input): Promise<T> {
    const response = await axios.get(input.url, { params: input.params })
    return response.data
  }
}
