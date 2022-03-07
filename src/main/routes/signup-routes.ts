import { Router } from 'express'
import { adaptRouter } from '../adapters/express-routes-adapter'
import { makeSignupController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignupController()) )

}