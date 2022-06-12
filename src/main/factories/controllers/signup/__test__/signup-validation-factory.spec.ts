import {
  CompareFieldsValidation,
  RequireFieldsValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../../../validation/validators';
import { Validation } from '../../../../../presentation/protocols/';
import { EmailValidator } from '../../../../../validation/protocols/email-validator';
import { makeSignUpValidation } from '../signup-validation-factory';



jest.mock('@/validation/validators/validationsComposite.ts');

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUp Validation', () => {
  it('Should call ValidationComposite with all Validation', () => {
    makeSignUpValidation();
    const emailValidatorStub = makeEmailvalidator();
    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequireFieldsValidation(field));
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirm')
    );
    validations.push(new EmailValidation('email', emailValidatorStub));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
