import { FacebookLoginController } from '@/infra/adapters/controllers'
import { makeFacebookAuthenticationUseCase } from '@/infra/factories/usecases/facebook-authentication'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationUseCase = makeFacebookAuthenticationUseCase()
  return new FacebookLoginController(facebookAuthenticationUseCase)
}
