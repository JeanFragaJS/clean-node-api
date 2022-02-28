import {EmailValidatorAdapter} from '@src/util/email-validator'
import validator from 'validator'

jest.mock('Validator', ()=> ({
  isEmail():boolean {
    return true
  }
}))

describe('Email Validator Adapter', ()=> {
  it('Should return false if validator returns false', ()=> {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    
    const isValid = sut.isValid('invalid-email@mail.com')
    expect(isValid).toBe(false)
  })

  it('Shoukd return true if valitor returns true', ()=> {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })
})