import { 
  CompareFieldsValidation, 
  RequireFieldsValidation, 
  ValidationComposite, 
  EmailValidation 
} from "@src/presentation/helpers/validators"
import { EmailValidator, Validation } from "@src/presentation/protocols"
import { makeSignUpValidation } from "../signup-validation"

jest.mock('@src/presentation/helpers/validators/validationsComposite.ts')

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};


describe('SignUp Validation', ()=> {
  it('Should call ValidationComposite with all Validation', () => {
    makeSignUpValidation()
    const emailValidatorStub = makeEmailvalidator()
    const validations: Validation[] = []

    for (const field of ['name', 'email','password', 'passwordConfirm']) {
      validations.push(new RequireFieldsValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    validations.push(new EmailValidation('email', emailValidatorStub))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})