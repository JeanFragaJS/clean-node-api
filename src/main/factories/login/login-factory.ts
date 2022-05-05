import env from '../../config/env'
import { makeLoginValidation } from './login-validation-factory'
import { LogControllerDecorator } from "@src/main/decorators/logs-controller-decorator";
import { Controller } from "@src/presentation/protocols";
import { LoginController } from "@src/presentation/controllers/login/login-controller";
import { DbAuthentication } from "@src/data/usecases/authentication/db-authentication";
import { LogMongoRepository } from "@src/infra/db/mongodb/log-repository/log-mongo-repository";
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'




export const makeLoginController = (): Controller => {
  const salt  = 12

  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)

  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository ()

  return new LogControllerDecorator(loginController,logMongoRepository)
}