import { DbAuthentication } from "../db-authentication"
import { AccountModel } from "../../db-add-account/db-add-account-protocols"
import { 
  AuthenticationModel, 
  LoadAccountByEmailRepository, 
  HashCompare, 
  UpdateAccessTokenRepository, 
  Encrypter 
} from "@src/data/usecases/authentication/db-authentication-protocols";



const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public loadByEmail (emai: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeUpdateAccessToken = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    public async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    public async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
 return new HashCompareStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    public async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any-token'))
    }
  }
  return new EncrypterStub()
}

const makeAccountModel = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.coom',
  password: 'any-hashed-password'
})

const makeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any@mail.com',
  password: 'any-password'
})

interface SutTypes {
  sut: DbAuthentication
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessToken()
  const encrypterStub = makeEncrypter()
  const hashCompareStub = makeHashCompare()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
 const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, encrypterStub, updateAccessTokenRepositoryStub)
 return {
  sut,
  hashCompareStub,
  encrypterStub,
  loadAccountByEmailRepositoryStub,
  updateAccessTokenRepositoryStub
 }

}


describe('DbAuthentication UseCase', ()=> {

  it('Should calls LoadAccountByEmailRepository with correct values', async () => {
    const {sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(makeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith(makeAuthenticationModel().email)
  })

  it('Should throw an error if LoadAccountByEmailRepository Throws an error', async () => {
    // O ERRO DEVE SER PROGAGADO ATÉ O CONTROLLER
    const {sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce( () => { throw new Error() })

    const promise = sut.auth(makeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailrepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)

    const promise = await sut.auth(makeAuthenticationModel())
    expect(promise).toBeNull()
  })

  it('Should calls HashCompare with correct value', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.auth(makeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith(makeAuthenticationModel().password, makeAccountModel().password)
  })

  it('Should throws an error if HashCompare throw an error', async () => {
    const {sut, hashCompareStub} = makeSut()
    jest.spyOn( hashCompareStub, 'compare').mockImplementationOnce(()=> {
      throw new Error()
    })

    const promise =  sut.auth(makeAuthenticationModel())
    expect(promise).rejects.toThrow()
  })

  it('Should returns null if HashCompare returns null', async () => {
    const { sut,  hashCompareStub} = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(null)

    const promise = await sut.auth(makeAuthenticationModel())
    expect(promise).toBeNull()
  })

  it('Should calls Encrypter with correct value', async () => {
    const { sut, encrypterStub} = makeSut()
    const gerenateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeAuthenticationModel())
    expect(gerenateSpy).toHaveBeenCalledWith(makeAccountModel().id)
  })

  it('Should throws if Encrypter throws', async () => {
    const {sut , encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeAuthenticationModel())
    expect(promise).rejects.toThrow()
  })

  it('Should returns null if Encrypter returns null', async () => {
    const { sut,  encrypterStub} = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(null)

    const promise = await sut.auth(makeAuthenticationModel())
    expect(promise).toBeNull()
  })

  it('Should returns accessToken with id', async () => {
    const { sut }= makeSut()
    const promise = await sut.auth(makeAuthenticationModel())
    expect(promise).toEqual('any-token')
  })
  

  it('Should calls UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } =makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    await sut.auth(makeAuthenticationModel())
    expect(updateSpy).toHaveBeenCalledWith('any-id', 'any-token')
  })

  it('Should throws if UpdateAccessTokenRepository throws', async () => {
    const {sut , updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeAuthenticationModel())
    expect(promise).rejects.toThrow()
  })
  
})