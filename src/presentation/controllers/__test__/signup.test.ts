import { SignUpController } from '@src/presentation/controllers/signup'
import {MissingParamError}  from '@src/presentation/error/missing-param-error'
import {InvalidParamError} from '@src/presentation/error/invalid-param-error copy'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator{
    public isValid (email: string):boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', ()=> {
  it('Should return 400 if name not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any-email@mail.com',
        password: 'anny_password',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError( 'name' ))
  })

  it('Should return 400 if email not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'anny_password',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if password not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any@any.com',
        passwordConfirm: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if passwordConfirm not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any@any.com',
        password: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  it('Should return 400 if provided invalid email ', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  
  it('Should call the isValid method with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@any.com',
        password: 'any',
        passwordConfirm: 'any'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any-email@any.com')
  })
})