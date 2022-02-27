import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from './protocols/controller'
import {HttpRequest, HttpResponse} from './protocols/http'

export class SignUpController implements Controller{
 public  handle (httpRequest: HttpRequest): HttpResponse  {
    let res: HttpResponse
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field  of requiredFields) {
      if (!httpRequest.body[field]) {
        res = badRequest(new MissingParamError(field))
      }  
    }
    return res
  }


}