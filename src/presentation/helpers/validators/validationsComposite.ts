import { Validation } from "@src/presentation/helpers/validators/validation";

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]
  
  constructor( validations: Validation[]) {
    this.validations = validations
  }

  public validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if( error ) {
        return error
      }
    }
    return null
  }
}