import { MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse } from './login-protocols';
import {badRequest} from '../../helpers/http-helper'

export class LoginController implements Controller{
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {
    const  fields = ['password', 'email']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return new Promise(resolve => resolve(null))
    
  }

}