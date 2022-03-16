import { InvalidParamError, MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse, Validation} from './login-protocols';
import { badRequest, unauthorized, serverError, ok} from '../../helpers/http-helper'
import { Authentication } from '@src/domain/usecases/authentication'

export class LoginController implements Controller{
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor ( authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {

    try{

      const error = this.validation.validate(httpRequest.body)
      
      // chek if the user is authorized
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized() 
      }

      // returns access token 
      return ok({ accessToken })

    } catch (error) {
      return serverError(error)
    }

  }

}