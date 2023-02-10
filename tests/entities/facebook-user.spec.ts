import { FacebookData, FacebookUserEntity, UserData } from '@/domain/entities/facebook-user'

const facebookData: FacebookData = {
  email: 'anyEmail@email.com',
  name: 'Any Facebook Name',
  facebookId: 'Any Facebook Id'
}

const userData: UserData = {
  id: 'Any User Id',
  name: 'Any User Name'
}

describe('FacebookUserEntity', () => {
  test('should create a new instance of FacebookUserEntity with facebookData only', () => {
    const sut = new FacebookUserEntity(facebookData)
    expect(sut).toEqual(facebookData)
  })

  test('should update name if its empty', () => {
    userData.name = undefined
    const sut = new FacebookUserEntity(facebookData, userData)
    expect(sut).toEqual({
      id: 'Any User Id',
      name: 'Any Facebook Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })
})
