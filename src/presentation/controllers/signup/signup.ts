import { InvalidParamError, MissingParamError } from '../../error';
import { serverError, badRequest, ok } from '../../helpers/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
  Validation
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(
    emailValidator: EmailValidator, 
    addAccount: AddAccount,
    validation: Validation
    ) {
    this.emailValidator = emailValidator;
    this.addAccount =  addAccount
    this.validation = validation
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirm } = httpRequest.body;
    
    try {
      this.validation.validate(httpRequest.body)

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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })
   
      return ok(account)  
    } catch (error) {
      //console.log(error)
      return serverError(error);
    }
  }
}
