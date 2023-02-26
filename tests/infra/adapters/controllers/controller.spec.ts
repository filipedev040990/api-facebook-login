import { ServerError } from '@/application/shared/errors'
import { Controller } from '@/infra/adapters/controllers'
import { mocked } from 'jest-mock'
import { ValidationComposite } from '@/infra/adapters/validation'
import { HttpResponse } from '@/application/shared/types'

jest.mock('@/infra/adapters/validation/composite')

class ControllerStub extends Controller {
  async execute (input: any): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {}
    }
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
    jest.clearAllMocks()
  })

  test('should return 400 if validation fails', async () => {
    const error = new Error('validaton_error')

    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      execute: jest.fn().mockReturnValueOnce(error)
    }))

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const response = await sut.handle('any')

    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(response).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('should return 500 if execute throws', async () => {
    const error = new Error()
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)

    const response = await sut.handle('any')

    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
  })

  test('should return same result as execute', async () => {
    const response = await sut.handle('any')

    expect(response).toEqual({
      statusCode: 200,
      body: {}
    })
  })
})
