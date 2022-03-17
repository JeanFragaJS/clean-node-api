import { AccountModel } from "../../add-account/db-add-account-protocols"
import {AuthenticationModel} from '@src/domain/usecases/authentication'
import { LoadAccountByEmailRepository } from "@src/data/protocols/db/load-account-by-email-repositroty"
import { DbAuthentication } from "../db-authentication"

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public load (emai: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeAccountModel = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.coom',
  password: 'any-password'
})

const makeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any@mail.com',
  password: 'any-password'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
 const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
 return {
  sut,
  loadAccountByEmailRepositoryStub
 }

}


describe('DbAuthentication UseCase', ()=> {

  it('Should calls LoadAccountByEmailRepository with correct values', async () => {
    const {sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith(makeAuthenticationModel().email)
  })

  it('Should throw an error if LoadAccountByEmailRepository Throws an error', async () => {
    // O ERRO DEVE SER PROGAGADO ATÉ O CONTROLLER
    const {sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockImplementationOnce( () => { throw new Error() })

    const promise = sut.auth(makeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })
})