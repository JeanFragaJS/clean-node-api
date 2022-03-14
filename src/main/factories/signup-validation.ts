
import { RequireFieldsValidation } from '@src/presentation/helpers/validators/requireFieldsValidation'
import { Validation } from '@src/presentation/helpers/validators/validation'
import { ValidationComposite } from '@src/presentation/helpers/validators/validations-composite'



export const makeSignUpValidation = ():ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequireFieldsValidation(field))
  }

  return new ValidationComposite(validations)
}