import { MissingParamError } from '@/presentation/error';
import { Validation } from '@/presentation/protocols';

export class RequireFieldsValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  public validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return undefined;
  }
}
