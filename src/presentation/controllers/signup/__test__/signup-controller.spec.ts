import { SignUpController } from '../signup-controller';
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation,
  Authentication,
  AuthenticationModel
} from '../signup-controller-protocols';
import { MissingParamError, ServerError, EmailInUseError } from '../../../../presentation/error';
import {
  ok,
  serverError,
  badRequest,
  forbidden
} from '../../../../presentation/helpers/http/http-helper';



jest.mock('@/validation/validators/validationsComposite.ts');


const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    public async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    public validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    public async auth(credentials: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve('any-token'));
    }
  }
  return new AuthenticationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password',
    passwordConfirm: 'any-password',
  },
});

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub); // makeSignUpValidation()
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  };
};

describe('SignUp Controller', () => {
  it('Shoud call addAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password',
    });
  });

  it('Shoul return 500 if addAcount fail', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('Should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce( ()=> Promise.resolve(null) )
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError));
  });

  it('Should return 200 if valid data is provided to addAccount', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({accessToken: 'any-token'}));
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 400 if Validaiton returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('field')));
  });

  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authspy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());
    expect(authspy).toHaveBeenCalledWith({
      email: 'any@mail.com',
      password: 'any-password',
    });
  });
});
