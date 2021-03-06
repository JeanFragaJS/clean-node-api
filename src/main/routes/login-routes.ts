import { Router } from 'express';
import { adaptRouter } from '../adapters/express/express-routes-adapter';
import { makeSignupController } from '@/main/factories/controllers/signup/signup-factory';
import { makeLoginController } from '@/main/factories/controllers/login/login-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignupController()));
  router.post('/login', adaptRouter(makeLoginController()));
};
