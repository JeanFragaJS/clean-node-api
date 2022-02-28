import { AddAccount, AddAccountModel } from "@src/domain/usecases/add-account"; 
import { Encrypter } from "./protocols/encrypter";
import { AccountModel } from "@src/domain/models/account";


export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }
  
  public async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
    //Não vamos colocar o try-catch aqui  justamente para se caso ocorra um erro 
    //ser lançado a diante
  }
}