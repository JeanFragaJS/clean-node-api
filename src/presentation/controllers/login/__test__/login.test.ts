import { InvalidParamError, MissingParamError } from '@src/presentation/error'
import { LoginController } from '../login'
import { badRequest, EmailValidator, HttpRequest } from '../login-protocols'
import { Authentication} from '@src/domain/usecases/authentication'
describe('SignIn Controller', () => {

  interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication 
  }


  const makehttpRequest = (): HttpRequest => ({
    body: {
      email: 'any@mail.com',
      password: 'any-password'
    }
  })

  const makeAuthenticationStub = (): Authentication => {
    class AuthenticationStub  implements Authentication {
      public async auth (email: string, password: string): Promise<string> {
        return new Promise(resolve => resolve('any-token'))
      }
    }
    return new AuthenticationStub()
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
    const authenticationStub = makeAuthenticationStub()
    const emailValidatorStub = makeEmailvalidatorStub()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
      sut,
      emailValidatorStub,
      authenticationStub 

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

    await sut.handle(makehttpRequest())
    expect(isValidSpy).toBeCalledWith('any@mail.com')
  })

  it('Should returns 400 when invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
   

    const httpResponse = await sut.handle(makehttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authspy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makehttpRequest())
    expect(authspy).toHaveBeenCalledWith('any@mail.com', 'any-password')
  })
})