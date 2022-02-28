import { EmailValidator } from "@src/presentation/protocols";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator{
  public isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}