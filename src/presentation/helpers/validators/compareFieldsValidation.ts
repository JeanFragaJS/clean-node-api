import { InvalidParamError } from "@src/presentation/error"
import { Validation } from "./validation"

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldNameToCompare: string

  constructor (fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName
    this.fieldNameToCompare = fieldNameToCompare
  }

  public validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}