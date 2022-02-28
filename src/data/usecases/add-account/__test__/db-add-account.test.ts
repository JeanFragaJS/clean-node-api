import { AddAccount } from '@src/domain/usecases/add-account'
import {DbAddAccount} from '../db-add-account'
import { Encrypter } from '../protocols/encrypter'

interface TypeSut {
  sut: AddAccount,
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    public encrypt ( vallue: string): Promise<string> {
      return new Promise(resolve => resolve('hashed-password'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): TypeSut => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}



describe('DbAddAccount Usecase', ()=> {
  it('Should call Encrypter with correct password', async ()=> {
    const {encrypterStub, sut} = makeSut()
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