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
  validationStubs: Validation[]
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {

  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs} = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({field: 'any-value'})

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more than one validations fails', () => {
    const {sut, validationStubs} = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate('field')
    expect(error).toEqual(new Error)
  })
}) 