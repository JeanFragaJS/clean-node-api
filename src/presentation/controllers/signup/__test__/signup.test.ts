import { SignUpController } from '../signup'
import { AddAccount, AddAccountModel, AccountModel, EmailValidator, HttpRequest} from '../signup-protocols'
import { InvalidParamError, ServerError,} from '@src/presentation/error'
import {ok, serverError, badRequest} from '@src/presentation/helpers/http-helper'

import { makeSignUpValidation } from "@src/main/factories/signUp-validation"

jest.mock('@src/presentation/helpers/validators/validations-composite')


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
  addAccountStub: AddAccount
  
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController( addAccountStub,  makeSignUpValidation());
  return {
    sut,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {

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

});
