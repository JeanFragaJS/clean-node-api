import { InvalidParamError, MissingParamError } from '../../error';
import { serverError, badRequest } from '../../helpers/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount

  constructor(
    emailValidator: EmailValidator, 
    addAccount: AddAccount
    ) {
    this.emailValidator = emailValidator;
    this.addAccount =  addAccount
  }
  public handle(httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirm } = httpRequest.body;
    try {
      let res: HttpResponse;
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this.addAccount.add({
        name,
        email,
        password
      })

      res = { statusCode: 200, body: account}
      return res
    } catch (error) {
      //console.log(error)
      return serverError();
    }
  }
}
