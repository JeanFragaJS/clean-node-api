import { EmailValidation } from '@src/presentation/helpers/validators/emailValidation'
import { RequireFieldsValidation } from '@src/presentation/helpers/validators/requireFieldsValidation'
import { Validation } from '@src/presentation/helpers/validators/validation'
import { ValidationComposite } from '@src/presentation/helpers/validators/validationsComposite'
import { EmailValidatorAdapter } from '@src/util/email-validator-adapapter'



export const makeLoginValidation = ():ValidationComposite => {
  const validations: Validation[] = []
  const emailValidator = new EmailValidatorAdapter()
  
  for (const field of ['email', 'password']) {
    validations.push(new RequireFieldsValidation(field))
  }
  validations.push(new EmailValidation('email', emailValidator))


  return new ValidationComposite(validations)
}