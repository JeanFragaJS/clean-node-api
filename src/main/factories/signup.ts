import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../util/email-validator-adapapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-mongo-repository'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller} from '../../presentation/protocols'

import { LogControllerDecorator } from '../decorators/logs-decorator'





export const makeSignupController = ():Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter() //email valitador vai pro signup controller 
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository) //db add account vai pro signup controller 
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}