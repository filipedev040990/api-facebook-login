import { MissinParamError } from '@/shared/errors/missin-param'
import { badRequest } from '@/shared/helpers/http'

class FacebookLoginController {
  async execute (input: any): Promise<any> {
    return badRequest(new MissinParamError('token'))
  }
}

describe('FacebookLoginController', () => {
  test('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()

    const response = await sut.execute({ token: '' })

    expect(response).toEqual(badRequest(new MissinParamError('token')))
  })
})
