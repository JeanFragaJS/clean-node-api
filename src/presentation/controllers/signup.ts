import { InvalidParamError, MissingParamError } from '../error'
import { serverError } from '../helpers/http-helper'
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
    try{
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
    } catch ( error ) {
      //console.log(error)
      return serverError()

    }
  }



}