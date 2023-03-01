import axios from 'axios'
import { AxiosHttpClientAdapter } from '@/infra/adapters/http'

jest.mock('axios')

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

  test('should rethrow if axios.get throws', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))

    const promise = sut.get({ url, params })

    await expect(promise).rejects.toThrow(new Error('http_error'))
  })
})
