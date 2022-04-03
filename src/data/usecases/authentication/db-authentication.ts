import { 
  Authentication,
  AuthenticationModel, 
  LoadAccountByEmailRepository, 
  HashCompare, 
  UpdateAccessTokenRepository, 
  Encrypter 
} from "@src/data/usecases/authentication/db-authentication-protocols";



//LoadAccountByEmailRepository
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor( 
    loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    hashCompare: HashCompare, 
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  public async auth (credentials: AuthenticationModel): Promise<string> {
      //check account
      const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)
      if( account ) {
        const isValid = await this.hashCompare.compare(credentials.password, account.password)
        if (isValid) {
          const accessToken = await this.encrypter.encrypt(account.id)
          await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
          return accessToken
        }  
      }
      return  null
  }
}