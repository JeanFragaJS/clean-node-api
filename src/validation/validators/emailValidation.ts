import { InvalidParamError } from '@/presentation/error';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { Validation } from '@/presentation/protocols';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  public validate(input: any): InvalidParamError {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
