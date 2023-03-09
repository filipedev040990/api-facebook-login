export type UserProfileInput = {
  pictureUrl?: string
  name?: string
}

export class UserProfile {
  initials?: string
  pictureUrl?: string

  constructor (readonly id: string) {}
  public setPicture ({ name, pictureUrl }: UserProfileInput): void {
    this.pictureUrl = pictureUrl
    if (!pictureUrl && name) {
      const firsLetters = name.match(/\b(.)/g)!
      if (firsLetters.length > 1) {
        this.initials = `${firsLetters.shift()!.toUpperCase()}${firsLetters.pop()!.toUpperCase()}`
      } else {
        this.initials = name.substring(0, 2).toUpperCase()
      }
    }
  }
}
