import {LogControllerDecorator} from '../log'
import {Controller, HttpRequest, HttpResponse} from '@src/presentation/protocols'
describe('Logs Controllers Decorator', () => {

  interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller
  }

  const makeController = (): Controller => {
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
    return new ControllerStub()
  } 

  const makeSut = (): SutTypes => {

  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
  }

  it('Should calls controller handle', async () => {
    const {controllerStub, sut} = makeSut()
    const handleSpy = jest.spyOn (controllerStub, 'handle')
    
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