import { AddAccount, AddAccountModel, Encrypter, AccountModel, AddAccountRepository  } from "./db-add-account-protocols"; 



export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }
  
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
   const hashedPassword =  await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign( {}, accountData, {password: hashedPassword}))
    return new Promise(resolve => resolve(null))
    //Não vamos colocar o try-catch aqui  justamente para se caso ocorra um erro 
    //ser lançado a diante
  }
}