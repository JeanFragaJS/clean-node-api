import { MissingParamError } from "@src/presentation/error"
import { Validation } from "../validation"
import { ValidationComposite } from "../validationsComposite"

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes  {
  sut: ValidationComposite
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {

  it('Should return an error if any validation fails', () => {
    const { sut, validationStub} = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({field: 'any-value'})

    expect(error).toEqual(new MissingParamError('field'))
  })
})