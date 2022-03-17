import { Authentication, AuthenticationModel } from "@src/domain/usecases/authentication";
import {LoadAccountByEmailRepository} from '@src/data/protocols/db/load-account-by-email-repositroty'
import { HashCompare } from "@src/data/protocols/cryptography/hash-compare";
import { TokenGenerator } from "@src/data/protocols/cryptography/token-generator";

//LoadAccountByEmailRepository
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator

  constructor( 
    loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    hashCompare: HashCompare, 
    tokenGenerator: TokenGenerator
    ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  public async auth (credentials: AuthenticationModel): Promise<string> {
      //check account
      const account = await this.loadAccountByEmailRepository.load(credentials.email)
      if( account ) {
        await this.hashCompare.compare(credentials.password, account.password)
        await this.tokenGenerator.generate(account.id)
      }
      return  null
  }
}