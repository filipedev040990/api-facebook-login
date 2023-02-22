import { FacebookLoginController } from '@/adapters/controllers'
import { makeFacebookAuthenticationService } from '../services/facebook-authentication'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationService = makeFacebookAuthenticationService()
  return new FacebookLoginController(facebookAuthenticationService)
}
