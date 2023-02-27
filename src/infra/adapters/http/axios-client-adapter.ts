import { HttpGetClient } from '@/application/contracts/http/http-client'
import axios from 'axios'
export class AxiosHttpClientAdapter implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.Input): Promise<any> {
    const response = await axios.get(url, { params })
    return response.data
  }
}
