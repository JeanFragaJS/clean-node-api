import { SignUpController } from '@src/presentation/controllers/signup';
import { EmailValidator } from '../protocols/email-validator';
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '@src/presentation/error';
import { AccountModel } from '@src/domain/models/account'
import { AddAccount, AddAccountModel} from '@src/domain/usecases/add-account'




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
    public add (account: AddAccountModel ): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }
  return new AddAccountStub() 
}

const makeEmailvalidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailvalidator();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should call the isValid method with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any',
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any-email@any.com');
  });

  it('Should return 500 if isValid method throw  Error', async () => {
    const {sut, emailValidatorStub} = makeSut() 
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=> {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Shoud call addAcount with correct values', async ()=> {
    const {sut, addAccountStub} = makeSut();
    const addSpy = jest.spyOn( addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any',
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@any.com',
      password: 'any',
    })
  })
});
