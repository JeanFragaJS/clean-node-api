import { Authentication, AuthenticationModel } from "@src/domain/usecases/authentication";
import {LoadAccountByEmailRepository} from '@src/data/protocols/load-account-by-email-repositroty'

//LoadAccountByEmailRepository
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor( loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  public async auth (credentials: AuthenticationModel): Promise<string> {
      //check account
      const account = await this.loadAccountByEmailRepository.load(credentials.email)
      return  null
  }
}