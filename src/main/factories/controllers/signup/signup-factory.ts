import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository';
import { makeDbAddAccount } from '@/main/factories/usecases/db-add-account-factory';
import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory';
import { LogControllerDecorator } from '@/main/decorators/logs-controller-decorator';
import { SignUpController } from '@/presentation/controllers/signup/signup-controller';
import { Controller } from '@/presentation/protocols';

export const makeSignupController = (): Controller => {
  const signupController = new SignUpController( makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication() );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signupController, logMongoRepository);
};
