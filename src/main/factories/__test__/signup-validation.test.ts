import { RequireFieldsValidation } from "@src/presentation/helpers/validators/requireFieldsValidation"
import { Validation } from "@src/presentation/helpers/validators/validation"
import { ValidationComposite } from "@src/presentation/helpers/validators/validations-composite"

import { makeSignUpValidation } from "../signUp-validation"

jest.mock('@src/presentation/helpers/validators/validations-composite')

describe('SignUp Validation', ()=> {
  it('Should call ValidationComposite with all Validation', () => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'password']) {
      validations.push(new RequireFieldsValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})