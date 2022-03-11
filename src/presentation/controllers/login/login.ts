import { MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse } from './login-protocols';
import {badRequest} from '../../helpers/http-helper'

export class LoginController implements Controller{
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }

}