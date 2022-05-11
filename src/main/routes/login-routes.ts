import { Router } from 'express';
import { adaptRouter } from '../adapters/express/express-routes-adapter';
import { makeSignupController } from '../factories/signup/signup-factory';
import { makeLoginController } from '../factories/login/login-factory';

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adaptRouter(makeSignupController()));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', adaptRouter(makeLoginController()));
};
