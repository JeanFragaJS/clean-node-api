import { InvalidParamError, MissingParamError } from '../error'
import { serverError, badRequest } from '../helpers/http-helper'
import {HttpRequest, HttpResponse, Controller, EmailValidator} from './protocols'

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