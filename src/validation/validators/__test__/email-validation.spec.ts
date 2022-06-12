import { EmailValidator } from '../../protocols/email-validator';
import { EmailValidation } from '../emailValidation';

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  emailValidatorStub: EmailValidator;
  sut: EmailValidation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailvalidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('Should call the isValid method with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const input = { email: 'any@mail.com' };
    sut.validate(input);
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com');
  });

  it('Should throws if isValid method throw  Error', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
