import { MissingParamError } from "@src/presentation/error"
import { Validation } from "../../protocols/validation"

export class RequireFieldsValidation implements Validation {
  private readonly fieldName: string
  constructor( fieldName: string) {
    this.fieldName = fieldName
  }
  public validate (input: any) : Error {
    if(!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    } 
    return undefined
  }
}