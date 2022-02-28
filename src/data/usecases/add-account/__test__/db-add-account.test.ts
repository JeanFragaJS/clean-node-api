import {DbAddAccount} from '../db-add-account'

describe('DbAddAccount Usecase', ()=> {
  it('Should call Encrypter with correct password', async ()=> {
    class EncrypterStub {
      public encrypt(value: string): Promise<string> {
        return  new Promise(resolve => resolve('hashed password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid-name',
      email: 'valid-mail',
      password: 'valid-password'
    }
   await sut.add(accountData)
   expect(encrypterSpy).toHaveBeenCalledWith('valid-password')
  })
})