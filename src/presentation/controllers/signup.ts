import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import {HttpRequest, HttpResponse} from './protocols/http'

export class SignUpcontroller {
  handle (httpRequest: HttpRequest): any  {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) 
      return badRequest(new MissingParamError('email'))
     
  }
}