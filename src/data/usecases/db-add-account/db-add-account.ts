import { AddAccount, AddAccountModel, Hasher, AccountModel, AddAccountRepository  } from "./db-add-account-protocols"; 



export class DbAddAccount implements AddAccount {
  
  constructor (
    private readonly hasher: Hasher, 
    private readonly addAccountRepository: AddAccountRepository) {}
  
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    
   const hashedPassword =  await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign( {}, accountData, {password: hashedPassword}))
    return account
    //Não vamos colocar o try-catch aqui  justamente para se caso ocorra um erro 
    //ser lançado a diante
  }
}