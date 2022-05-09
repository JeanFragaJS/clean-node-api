import {LogControllerDecorator} from '../logs-controller-decorator'
import {Controller, HttpRequest, HttpResponse} from '@/presentation/protocols'
import { serverError } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

describe('Logs Controllers Decorator', () => {



  const makelogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
     public async logError (stack: string): Promise<void> {
        return new Promise(resolve => resolve())
      }
    }
    return new LogErrorRepositoryStub()
  }

  const makeController = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            id: 'any-id',
            name: 'any-name',
            email: 'any@mail.com',
            password: 'any-password'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
    }  
    }
    return new ControllerStub()
  } 

  interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller,
    logErrorRepository: LogErrorRepository
  }

  const makeSut = (): SutTypes => {

  const controllerStub = makeController()
  const logErrorRepository = makelogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository)
  return {
    sut,
    controllerStub,
    logErrorRepository
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

    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  it('Should return dependency httpResponse controller ', async () => {
    const { sut } =  makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(expect.objectContaining({
        name: 'any-name',
        email: 'any@mail.com',
        password: 'any-password',
        id: 'any-id'
    }))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, logErrorRepository, controllerStub} = makeSut()
    const fakeError= new Error()
    fakeError.stack = 'any-stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepository, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@mail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any-stack')


  })
  
})