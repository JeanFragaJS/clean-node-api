import env from '../../config/env'
import { DbAddAccount } from '../../../data/usecases/db-add-account/db-add-account';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/logs-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';

export const makeSignupController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository); //db add account vai pro signup controller
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signupController = new SignUpController( dbAddAccount, makeSignUpValidation(), dbAuthentication );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signupController, logMongoRepository);
};
