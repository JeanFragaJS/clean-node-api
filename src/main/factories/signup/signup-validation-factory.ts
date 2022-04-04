
import { 
  CompareFieldsValidation, 
  EmailValidation, 
  RequireFieldsValidation, 
  ValidationComposite
} from '@src/presentation/helpers/validators'
import { Validation } from '@src/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@src/main/adapters/validator/email-validator-adapapter'



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