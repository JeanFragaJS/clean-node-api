import {DbAddAccount} from '../db-add-account'
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository} from '../db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    public encrypt ( vallue: string): Promise<string> {
      return new Promise(resolve => resolve('hashed-password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add (accountData: AddAccountModel): Promise<AccountModel>{
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }

      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    addAccountRepositoryStub,
    sut,
    encrypterStub
  }
}

const makeFakeAccountModel = ():AddAccountModel => ({
  name: 'valid-name',
  email: 'valid-mail',
  password: 'valid-password'
})

describe('DbAddAccount Usecase', ()=> {

  it('Should call Encrypter with correct password', async ()=> {
    const {encrypterStub, sut} = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountModel())
    expect(encrypterSpy).toHaveBeenCalledWith('valid-password')
  })

  it('Should throw if Encrypter throw', async ()=> {
    const {sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=>  reject(new Error()) ) )

    const promise = sut.add(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
    //Garanti que o try-catch nao será implementado justamente para o erro ser lançado a diante 
  })

  it('Should calls addAccountRepository with correct values', async ()=> {

    const {sut, addAccountRepositoryStub } = makeSut()
    const addSpy =  jest.spyOn(addAccountRepositoryStub, 'add')
    const addAccountModel = {
      name: 'valid-name',
      email: 'valid-mail',
      password: 'hashed-password'
    }
    await sut.add(addAccountModel)
    expect(addSpy).toHaveBeenCalledWith(addAccountModel)
  })
})