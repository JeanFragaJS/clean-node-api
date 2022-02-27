import { InvalidParamError } from '../error/invalid-param-error copy'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from './protocols/controller'
import { EmailValidator } from './protocols/email-validator'
import {HttpRequest, HttpResponse} from './protocols/http'

export class SignUpController implements Controller{
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
 public  handle (httpRequest: HttpRequest): HttpResponse  {
    const {name, email, password, passwordConfirm } = httpRequest.body
    
    let res: HttpResponse
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field  of requiredFields) {
      if (!httpRequest.body[field]) {
        res = badRequest(new MissingParamError(field))
      }  
    }

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return res
  }


}