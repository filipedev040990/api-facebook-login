import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('anyId')
  })
  test('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'anyUrl', name: 'anyName' })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: 'anyUrl',
      initials: undefined
    })
  })

  test('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'anyUrl' })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: 'anyUrl',
      initials: undefined
    })
  })

  test('should create with initials with firsts letter of first and last name when pictureUrl is undefined', () => {
    sut.setPicture({ name: 'zezinho das couves' })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: undefined,
      initials: 'ZC'
    })
  })

  test('should create with initials with firsts two letter of first name when pictureUrl is undefined', () => {
    sut.setPicture({ name: 'zezinho' })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: undefined,
      initials: 'ZE'
    })
  })

  test('should create with initials with first letter', () => {
    sut.setPicture({ name: 'z' })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: undefined,
      initials: 'Z'
    })
  })

  test('should create with empty initials when pictureUrl and name are not provided', () => {
    sut.setPicture({ })

    expect(sut).toEqual({
      id: 'anyId',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
