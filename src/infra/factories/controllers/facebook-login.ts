import { FacebookLoginController } from '@/adapters/controllers'
import { makeFacebookAuthenticationUseCase } from '../usecases/facebook-authentication'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationUseCase = makeFacebookAuthenticationUseCase()
  return new FacebookLoginController(facebookAuthenticationUseCase)
}
