export type FacebookData = {
  name: string
  email: string
  facebookId: string
}

export type UserData = {
  id?: string
  name?: string
}

export class FacebookUserEntity {
  id?: string
  name: string
  email: string
  facebookId: string

  constructor (facebookData: FacebookData, userData?: UserData) {
    this.id = userData?.id
    this.name = userData?.name ?? facebookData.name
    this.email = facebookData.email
    this.facebookId = facebookData.facebookId
  }
}
