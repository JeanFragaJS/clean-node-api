import {
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldsValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const emailValidator = new EmailValidatorAdapter();

  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));
  validations.push(new EmailValidation('email', emailValidator));

  return new ValidationComposite(validations);
};
