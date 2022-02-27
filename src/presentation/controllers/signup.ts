import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import {HttpRequest, HttpResponse} from './protocols/http'

export class SignUpcontroller {
  handle (httpRequest: HttpRequest): any  {

    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field  of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }


}