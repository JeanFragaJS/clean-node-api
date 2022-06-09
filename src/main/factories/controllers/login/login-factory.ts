import { makeLoginValidation } from '@/main/factories/controllers/login/login-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory';
import { LogControllerDecorator } from '@/main/decorators/logs-controller-decorator';
import { LoginController } from '@/presentation/controllers/login/login-controller';
import { Controller } from '@/presentation/protocols';
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController( makeDbAuthentication(), makeLoginValidation() );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
