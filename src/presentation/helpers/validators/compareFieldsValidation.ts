import { InvalidParamError } from '../../../presentation/error';
import { Validation } from '../../protocols/validation';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  public validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
