import { SignUpcontroller } from '@src/presentation/controllers/signup'
import {MissingParamError}  from '@src/presentation/error/missing-param-error'

describe('SignUp Controller', ()=> {
  it('Should return 400 if name not provided', async () => {
    const sut = new SignUpcontroller()

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
    const sut = new SignUpcontroller()

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
})