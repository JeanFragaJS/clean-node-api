import { InvalidParamError, MissingParamError } from '@src/presentation/error'
import { LoginController } from '../login'
import { badRequest, Controller, EmailValidator, HttpRequest, HttpResponse } from '../login-protocols'

describe('SignIn Controller', () => {

  interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
  }

  const makeEmailvalidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements  EmailValidator {
      public isValid (email: string): boolean {
        return true
      }
    }
    return new EmailValidatorStub()
  }

  const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailvalidatorStub()
    const sut = new LoginController(emailValidatorStub)
    return {
      sut,
      emailValidatorStub
    }
  }

  it('Should return 400 if email is not provided', async () => {
    const{  sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should returns 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password'))) 
  })

  it('Should calls emailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any-password'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any@mail.com')
  })

  it('', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})