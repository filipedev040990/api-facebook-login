import { FacebookData, FacebookUserEntity } from '@/domain/entities/facebook-user'

const facebookData: FacebookData = {
  email: 'anyEmail@email.com',
  name: 'Any Facebook Name',
  facebookId: 'Any Facebook Id'
}

describe('FacebookUserEntity', () => {
  test('should create a new instance of FacebookUserEntity with facebookData only', () => {
    const sut = new FacebookUserEntity(facebookData)
    expect(sut).toEqual(facebookData)
  })
})
