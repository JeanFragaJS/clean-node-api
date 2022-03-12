import { InvalidParamError, MissingParamError } from '@src/presentation/error'
import { LoginController } from '../login'
import { badRequest, unauthorized, EmailValidator, HttpRequest, serverError, ok } from '../login-protocols'
import { Authentication} from '@src/domain/usecases/authentication'
describe('SignIn Controller', () => {

  interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication 
  }


  const makeHttpRequest = (): HttpRequest => ({
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

    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toBeCalledWith('any@mail.com')
  })

  it('Should returns 400 when invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
   

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should returns 500 if EmailValidator Throws error', async () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn( emailValidatorStub, 'isValid').mockImplementationOnce( ()=> {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error)) 
  })

  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authspy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeHttpRequest())
    expect(authspy).toHaveBeenCalledWith('any@mail.com', 'any-password')
  })

  it('Should returns 401 if authentication throws errors be cause invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce( new Promise(resolve => resolve(null))) 

   const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should returns 500 if Authentication throws error', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn( authenticationStub, 'auth').mockReturnValueOnce(new Promise( (resolve,reject) => reject(new Error()) ) )

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual( ok({ accessToken: 'any-token' }))
  })
})