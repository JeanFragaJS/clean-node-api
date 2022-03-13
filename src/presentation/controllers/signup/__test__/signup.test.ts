import { SignUpController } from '../signup'
import { AddAccount, AddAccountModel, AccountModel, EmailValidator, HttpRequest, Validation} from '../signup-protocols'
import { MissingParamError,InvalidParamError, ServerError,} from '@src/presentation/error'
import {ok, serverError, badRequest} from '@src/presentation/helpers/http-helper'

const makeValidation = (): Validation => {
  class validationStub implements Validation {
    public validate (input: any): Error {
      return null
    }
  }
  return new validationStub()
}

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    public async add (account: AddAccountModel ): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))

    }
  }
  return new AddAccountStub() 
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any',
    passwordConfirm: 'any',
  }
})

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailvalidator();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  };
};

describe('SignUp Controller', () => {
  it('Should return 400 if name not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any-email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  it('Should return 400 if email not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any_password',
        passwordConfirm: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
 
  });

  it('Should return 400 if password not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any@any.com',
        passwordConfirm: '',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual( badRequest(new MissingParamError('password')));
   
  });

  it('Should return 400 if passwordConfirm not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any@any.com',
        password: 'any',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')));
   
  });
  
  it('Should return 400 if passwordConfirm fail', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any@any.com',
        password: 'any',
        passwordConfirm: 'invalidPasswordconfirm'
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest( new InvalidParamError('passwordConfirm')));
   
  });

  it('Should return 400 if provided invalid email ', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest( new InvalidParamError('email')));
    expect(httpResponse.body)
  });

  it('Should call the isValid method with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com');
  });

  it('Should return 500 if isValid method throw  Error', async () => {
    const {sut, emailValidatorStub} = makeSut() 
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(()=> {
        throw new Error()
      })

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('Shoud call addAcount with correct values', async ()=> {
    const {sut, addAccountStub} = makeSut();
    const addSpy = jest.spyOn( addAccountStub, 'add')

    sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any',
    })
  })

  it('Shoul return 500 if addAcount fail', async ()=> {
    const { sut,  addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce( async () => {
     return  new Promise((resolve, reject)=> reject(new Error))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))

  })

  it('Should return 200 if valid data is provided to addAccount', async () => {
    const { sut } =  makeSut()

    const httpResponse =  await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('Should calls the validate method with correct values', async () => {
    const {sut , validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
});
