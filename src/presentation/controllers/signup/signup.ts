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
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(  addAccount: AddAccount, validation: Validation) {
    this.addAccount =  addAccount
    this.validation = validation
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirm } = httpRequest.body;
    
    try {
      this.validation.validate(httpRequest.body)

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
