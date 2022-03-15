import { MissingParamError } from "@src/presentation/error"
import { Validation } from "../validation"
import { ValidationComposite } from "../validationsComposite"

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: any): Error {
      return new MissingParamError('field')
    }
  }
  return new ValidationStub()
}

describe('Validation Composite', () => {

  it('Should return an error if any validation fails', () => {
    const sut = new ValidationComposite([makeValidationStub()])
    const error = sut.validate({field: 'any-value'})

    expect(error).toEqual(new MissingParamError('field'))
  })
})