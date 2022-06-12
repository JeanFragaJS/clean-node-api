import { RequireFieldsValidation } from '../requireFieldsValidation';
import { MissingParamError } from '../../../presentation/error/missing-param-error';

describe('Require Fields Validation', () => {
  it('Should return Missing Param Error if field is not provided', async () => {
    const sut = new RequireFieldsValidation('field');
    const error = sut.validate({ name: 'any-name' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Shoud not return if RequireFields is success', () => {
    const sut = new RequireFieldsValidation('field');
    const error = sut.validate({ field: 'any-field' });

    expect(error).toBeFalsy();
  });

  // it('Should return 400 if email not provided', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: 'any-name',
  //       password: 'any_password',
  //       passwordConfirm: 'any_password',
  //     },
  //   };

  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))

  // });

  // it('Should return 400 if password not provided', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: 'any-name',
  //       email: 'any@any.com',
  //       passwordConfirm: '',
  //     },
  //   };

  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual( badRequest(new MissingParamError('password')));

  // });

  // it('Should return 400 if passwordConfirm not provided', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: 'any-name',
  //       email: 'any@any.com',
  //       password: 'any',
  //     },
  //   };

  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')));

  // });
});
