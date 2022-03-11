import { MissingParamError } from '@src/presentation/error'
import { LoginController } from '../login'
import { badRequest } from '../login-protocols'

describe('SignIn Controller', () => {
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
})