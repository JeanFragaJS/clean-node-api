import {
  EmailValidation,
  RequireFieldsValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const emailValidator = new EmailValidatorAdapter();

  for (const field of ['email', 'password']) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new EmailValidation('email', emailValidator));

  return new ValidationComposite(validations);
};
