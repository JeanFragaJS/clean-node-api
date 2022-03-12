import { InvalidParamError, MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse, EmailValidator} from './login-protocols';
import { badRequest } from '../../helpers/http-helper'
import { Authentication } from '@src/domain/usecases/authentication'

export class LoginController implements Controller{
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {

    // check the fields exists
    const  fields = ['password', 'email']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    // check the email is valid
    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'))
    }

    const accessToken = await this.authentication.auth(httpRequest.body.email, httpRequest.body.password)

    return new Promise(resolve => resolve(null))
    
  }

}