class FacebookLoginController {
  async execute (input: any): Promise<any> {
    return {
      statusCode: 400,
      body: {
        message: 'This field is required'
      }
    }
  }
}

describe('FacebookLoginController', () => {
  test('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()

    const response = await sut.execute({ token: '' })

    expect(response).toEqual({
      statusCode: 400,
      body: {
        message: 'This field is required'
      }
    })
  })
})
