import {DbAddAccount} from '../db-add-account'
import { Encrypter } from '../db-add-account-protocols'

interface TypeSut {
  sut: DbAddAccount,
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

  it('Should throw if Encrypter throw', async ()=> {
    const {sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=>  reject(new Error()) ) )

    const accountData = {
      name: 'valid-name',
      email: 'valid-mail',
      password: 'valid-password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
    //Garanti que o try-catch nao será implementado justamente para o erro ser lançado a diante 
  })
})