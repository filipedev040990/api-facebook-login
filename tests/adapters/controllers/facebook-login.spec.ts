import { MissinParamError } from '@/shared/errors/missin-param'
import { badRequest } from '@/shared/helpers/http'

class FacebookLoginController {
  async execute (input: any): Promise<any> {
    return badRequest(new MissinParamError('token'))
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  beforeAll(() => {
    sut = new FacebookLoginController()
  })

  test('should return 400 if token is empty', async () => {
    const response = await sut.execute({ token: '' })

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })

  test('should return 400 if token is null', async () => {
    const response = await sut.execute({ token: null })

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })

  test('should return 400 if token is undefined', async () => {
    const response = await sut.execute({ })

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })
})
