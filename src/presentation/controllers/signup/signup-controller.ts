import { serverError, badRequest, ok } from '../../helpers/http/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
} from './signup-controller-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirm } = httpRequest.body;

    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      //console.log(error)
      return serverError(error);
    }
  }
}
