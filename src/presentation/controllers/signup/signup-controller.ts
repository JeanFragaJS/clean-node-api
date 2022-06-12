import { EmailInUseError } from '@/presentation/error';
import { serverError, badRequest, forbidden, ok } from '@/presentation/helpers/http/http-helper';
import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
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

      if( !account ) {
        return forbidden( new EmailInUseError() )
      }

      const accessToken =  await this.authentication.auth({
        email,
        password
      })


      return ok({accessToken});
    } catch (error) {
     // console.log(error)
      return serverError(error);
    }
  }
}
