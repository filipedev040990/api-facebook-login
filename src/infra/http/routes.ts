import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeFacebookLoginController } from '../factories/controllers/facebook-login'

const router = Router()

router.post('/login/facebook', adaptRoute(makeFacebookLoginController()))

export { router }
