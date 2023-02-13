import axios from 'axios'
import { HttpGetClient } from '.'

jest.mock('axios')

export class AxiosHttpClientAdapter {
  async get (input: HttpGetClient.Input): Promise<any> {
    const response = await axios.get(input.url, { params: input.params })
    return response.data
  }
}

describe('AxiosHttpClientAdapter', () => {
  let url: string
  let params: object
  let sut: AxiosHttpClientAdapter
  let fakeAxios: jest.Mocked<typeof axios>

  beforeAll(() => {
    sut = new AxiosHttpClientAdapter()
    url = 'any_url'
    params = {
      any: 'any'
    }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  test('should call get once and with correct params', async () => {
    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
  })

  test('should return data on success', async () => {
    const response = await sut.get({ url, params })

    expect(response).toEqual('any_data')
  })
})
