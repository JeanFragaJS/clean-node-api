import { MissingParamError } from '@/presentation/error';
import { LoginController } from '../login-controller';
import {
  badRequest,
  unauthorized,
  HttpRequest,
  serverError,
  ok,
  Validation,
  Authentication,
  AuthenticationModel
} from '../login-controller-protocols';


const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any@mail.com',
    password: 'any-password',
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    public validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    public async auth(credentials: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve('any-token'));
    }
  }
  return new AuthenticationStub();
};

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('SignIn Controller', () => {
  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authspy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeHttpRequest());
    expect(authspy).toHaveBeenCalledWith({
      email: 'any@mail.com',
      password: 'any-password',
    });
  });

  it('Should returns 401 if authentication throws errors be cause invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should returns 500 if Authentication throws error', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any-token' }));
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeHttpRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 400 if Validaiton returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('field')));
  });
});
