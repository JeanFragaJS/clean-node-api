import { RequireFieldsValidation, ValidationComposite, EmailValidation} from '../../../../../validation/validators';
import { Validation } from '../../../../../presentation/protocols'
import { EmailValidator }  from '../../../../../validation/protocols/email-validator';
import { makeLoginValidation } from '../login-validation-factory';



jest.mock('@/validation/validators/validationsComposite.ts');

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
