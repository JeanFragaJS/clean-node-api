import { Controller, HttpRequest, HttpResponse, Validation} from './login-controller-protocols';
import { badRequest, unauthorized, serverError, ok} from '../../helpers/http/http-helper'
import { Authentication } from '@src/domain/usecases/authentication'

export class LoginController implements Controller{


  constructor ( 
    private readonly authentication: Authentication, 
    private readonly validation: Validation) {}

  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {
    try{

      const error = this.validation.validate(httpRequest.body)
      if( error ) {
        return badRequest( error )
      }
      // chek if the user is authorized
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({email, password})
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