import { InvalidParamError } from "@src/presentation/error";
import { EmailValidator } from "@src/presentation/protocols";
import { Validation } from "../../protocols/validation";


export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName 
    this.emailValidator = emailValidator
  }

  public validate (input: any): InvalidParamError {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}