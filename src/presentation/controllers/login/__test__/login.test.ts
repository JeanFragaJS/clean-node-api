import { MissingParamError } from '@src/presentation/error'
import { LoginController } from '../login'
import { badRequest, Controller, HttpRequest, HttpResponse } from '../login-protocols'

describe('SignIn Controller', () => {

  // interface SutTypes {
  //   sut: LoginController
  // }

  // const makeSut = (): SutTypes => {
  //   const sut = new LoginController()
  //   return {
  //     sut 
  //   }
  // }

  it('Should return 400 if email is not provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should returns 400 if password is not provided', async () => {
    const sut =  new LoginController() //makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password'))) 
  })
})