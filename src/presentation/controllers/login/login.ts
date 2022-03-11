import { MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse, EmailValidator} from './login-protocols';
import {badRequest} from '../../helpers/http-helper'

export class LoginController implements Controller{
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {
    const  fields = ['password', 'email']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    return new Promise(resolve => resolve(null))
    
  }

}