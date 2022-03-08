import {LogControllerDecorator} from '../log'
import {Controller, HttpRequest, HttpResponse} from '@src/presentation/protocols'
describe('Logs Controllers Decorator', () => {
// const makeSut = (): LogControllerDecorator => {
//   class LogControllerDecorator implements Controller
// }

  it('Should calls controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'any',
            email: 'any@mail',
            password: 'any-password'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
     }  
    }
  
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn (controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        name: 'any',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }

   const decorator = await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })
})