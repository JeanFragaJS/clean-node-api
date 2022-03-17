import { DbAuthentication } from "../db-authentication"
import { AccountModel } from "../../add-account/db-add-account-protocols"
import { 
  AuthenticationModel, 
  LoadAccountByEmailRepository, 
  HashCompare, 
  UpdateAccessTokenRepository, 
  TokenGenerator 
} from "@src/data/usecases/authentication/db-authentication-protocols";



const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public load (emai: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeUpdateAccessToken = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    public async update (id: string, token: string): Promise<void> {
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    public async generate (id: string): Promise<string> {
      return new Promise(resolve => resolve('any-token'))
    }
  }
  return new TokenGeneratorStub()
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
  tokenGeneratorStub: TokenGenerator
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessToken()
  const tokenGeneratorStub = makeTokenGenerator()
  const hashCompareStub = makeHashCompare()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
 const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
 return {
  sut,
  hashCompareStub,
  tokenGeneratorStub,
  loadAccountByEmailRepositoryStub,
  updateAccessTokenRepositoryStub
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

  it('Should return null if LoadAccountByEmailrepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

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

  it('Should calls TokenGenerator with correct value', async () => {
    const { sut, tokenGeneratorStub} = makeSut()
    const gerenateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeAuthenticationModel())
    expect(gerenateSpy).toHaveBeenCalledWith(makeAccountModel().id)
  })

  it('Should throws if TokenGenerator throws', async () => {
    const {sut , tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeAuthenticationModel())
    expect(promise).rejects.toThrow()
  })

  it('Should returns null if TokenGenerator returns null', async () => {
    const { sut,  tokenGeneratorStub} = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(null)

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
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeAuthenticationModel())
    expect(updateSpy).toHaveBeenCalledWith('any-id', 'any-token')
  })

  it('Should throws if UpdateAccessTokenRepository throws', async () => {
    const {sut , updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeAuthenticationModel())
    expect(promise).rejects.toThrow()
  })
  
})