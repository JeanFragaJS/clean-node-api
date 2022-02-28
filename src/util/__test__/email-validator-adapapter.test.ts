import {EmailValidatorAdapter} from '@src/util/email-validator-adapapter'
import validator from 'validator'

jest.mock('Validator', ()=> ({
  isEmail():boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('Email Validator Adapter', ()=> {
  it('Should return false if validator returns false', ()=> {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid-email@mail.com')
    expect(isValid).toBe(false)
  })

  it('Shoukd return true if valitor returns true', ()=> {
    const sut = makeSut()

    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })

  it('Should call Validator with correct email', ()=> {
    const sut = makeSut()
    const isValid = jest.spyOn(validator, 'isEmail')

    sut.isValid('valid_mail@mail.com')
    expect(isValid).toHaveBeenCalledWith('valid_mail@mail.com')
  })
})