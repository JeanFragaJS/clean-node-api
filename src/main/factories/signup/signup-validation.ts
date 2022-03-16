
import { CompareFieldsValidation } from '@src/presentation/helpers/validators/compareFieldsValidation'
import { EmailValidation } from '@src/presentation/helpers/validators/emailValidation'
import { RequireFieldsValidation } from '@src/presentation/helpers/validators/requireFieldsValidation'
import { Validation } from '@src/presentation/protocols/validation'
import { ValidationComposite } from '@src/presentation/helpers/validators/validationsComposite'
import { EmailValidatorAdapter } from '@src/util/email-validator-adapapter'



export const makeSignUpValidation = ():ValidationComposite => {
  const validations: Validation[] = []
  const emailValidator = new EmailValidatorAdapter()
  
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequireFieldsValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validations.push(new EmailValidation('email', emailValidator))


  return new ValidationComposite(validations)
}