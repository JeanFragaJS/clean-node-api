import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../util/email-validator-adapapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignupController = ():SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter() //email valitador vai pro signup controller 
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository) //db add account vai pro signup controller 
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}