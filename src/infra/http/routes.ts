import { Router } from 'express'
import { expressAdapteRouter } from '@/infra/adapters/http'
import { makeFacebookLoginController } from '@/infra/factories/controllers/facebook-login'

const router = Router()

router.post('/login/facebook', expressAdapteRouter(makeFacebookLoginController()))

export { router }
