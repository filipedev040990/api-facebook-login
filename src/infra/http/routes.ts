import { Router } from 'express'
import { expressAdapteRouter } from '../adapters/express-route'
import { makeFacebookLoginController } from '../factories/controllers/facebook-login'

const router = Router()

router.post('/login/facebook', expressAdapteRouter(makeFacebookLoginController()))

export { router }
