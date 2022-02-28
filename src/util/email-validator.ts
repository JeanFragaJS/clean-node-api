import { EmailValidator } from "@src/presentation/protocols";

export class EmailValidatorAdapter implements EmailValidator{
  public isValid(email: string): boolean {
    return false
  }
}