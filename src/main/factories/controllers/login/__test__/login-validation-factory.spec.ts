import {
  RequireFieldsValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../../../presentation/helpers/validators';
import { Validation, EmailValidator } from '../../../../../presentation/protocols';

import { makeLoginValidation } from '../login-validation-factory';

jest.mock('@/presentation/helpers/validators/validationsComposite.ts');

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('Login Validation', () => {
  it('Should call ValidationComposite with all Validation', () => {
    makeLoginValidation();
    const emailValidatorStub = makeEmailvalidator();
    const validations: Validation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequireFieldsValidation(field));
    }
    validations.push(new EmailValidation('email', emailValidatorStub));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
