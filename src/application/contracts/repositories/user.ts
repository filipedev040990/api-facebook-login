export interface GetUser {
  getByEmail: (input: GetUser.Input) => Promise<GetUser.Output>
}

export namespace GetUser {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveUserFromFacebook {
  saveWithFacebook: (input: SaveUserFromFacebook.Input) => Promise<SaveUserFromFacebook.Output>
}

export namespace SaveUserFromFacebook {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = {
    id: string
  }
}

export interface SavePicture {
  savePictureUrl: (input: SavePicture.Input) => Promise<SavePicture.Output>
}

export namespace SavePicture {
  export type Input = { id: string, pictureUrl?: string, initials?: string }
  export type Output = string
}
export interface GetUserById {
  getById: (input: GetUserById.Input) => Promise<GetUserById.Output>
}

export namespace GetUserById {
  export type Input = { id: string }
  export type Output = { name?: string } | undefined
}

export interface SavePictureUrl {
  savePictureUrl: (input: SavePictureUrl.Input) => Promise<void>
}

export namespace SavePictureUrl {
  export type Input = { id: string, pictureUrl?: string, initials?: string }
}
