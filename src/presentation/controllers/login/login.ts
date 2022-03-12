import { InvalidParamError, MissingParamError } from '@src/presentation/error';
import { Controller, HttpRequest, HttpResponse, EmailValidator} from './login-protocols';
import { badRequest, unauthorized, serverError, ok} from '../../helpers/http-helper'
import { Authentication } from '@src/domain/usecases/authentication'

export class LoginController implements Controller{
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }
  public async handle  (httpRequest: HttpRequest): Promise<HttpResponse> {

    try{
      // check the fields exists
      const  fields = ['password', 'email']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      // check the email is valid
      const { email, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      // chek if the user is authorized
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized() 
      }

      // returns access token 
      return ok({ accessToken })

    } catch (error) {
      return serverError(error)
    }

  }

}