import { DbAddAccount } from '@src/data/usecases/add-account/db-add-account'
import { SignUpController } from '@src/presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '@src/util/email-validator-adapapter'
import { BcryptAdapter } from '@src/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account-repository/account'

export const makeSignupController = ():SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpcontroller = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return signUpcontroller
}