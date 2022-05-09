import { CompareFieldsValidation } from "../compareFieldsValidation";
import {InvalidParamError} from '@/presentation/error/invalid-param-error'

describe('CompareFieldsValidation', () => {
  
  it('Should return 400 if passwordConfirm fail', async () => {
    const  sut  = new CompareFieldsValidation( 'field', 'fieldToCompare')
    const error =  sut.validate({field: 'password', fieldToCompare: 'passwordWrong'});

    
    expect(error).toEqual( new InvalidParamError('field'));
   
  });

  it('Should not return if validation success', ()=> {
    const sut  = new CompareFieldsValidation('field', 'fieldToCompare')
    const error = sut.validate({field: 'any', fieldToCompare: 'any'})

    expect(error).toBeFalsy()
  })
})