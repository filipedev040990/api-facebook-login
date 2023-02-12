import { FacebookData, FacebookUserEntity, UserData } from '@/domain/entities'

let facebookData: FacebookData
let userData: UserData

describe('FacebookUserEntity', () => {
  beforeEach(() => {
    facebookData = {
      email: 'anyEmail@email.com',
      name: 'Any Facebook Name',
      facebookId: 'Any Facebook Id'
    }

    userData = {
      id: 'Any User Id',
      name: 'Any User Name'
    }
  })
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

  test('should not update name if its not empty', () => {
    const sut = new FacebookUserEntity(facebookData, userData)

    expect(sut).toEqual({
      id: 'Any User Id',
      name: 'Any User Name',
      email: 'anyEmail@email.com',
      facebookId: 'Any Facebook Id'
    })
  })
})
