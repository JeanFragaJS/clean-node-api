import { Authentication, AuthenticationModel } from "@src/domain/usecases/authentication";
import {LoadAccountByEmailRepository} from '@src/data/protocols/db/load-account-by-email-repositroty'
import { HashCompare } from "@src/data/protocols/cryptography/hash-compare";

//LoadAccountByEmailRepository
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare

  constructor( loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  public async auth (credentials: AuthenticationModel): Promise<string> {
      //check account
      const account = await this.loadAccountByEmailRepository.load(credentials.email)
      if( account ) {
        this.hashCompare.compare(credentials.password, account.password)
      }
      return  null
  }
}