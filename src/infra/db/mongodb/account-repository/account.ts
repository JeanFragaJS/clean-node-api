import { AddAccountRepository } from "@src/data/protocols/add-account-repository";
import { AccountModel } from "@src/domain/models/account";
import {AddAccountModel} from '@src/data/usecases/add-account/db-add-account-protocols'
import { MongoHelper } from "../helpers/mongo-helpers";

export class AccountMongoRepository implements AddAccountRepository {
  
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = accountCollection.insertOne(accountData)
    const { _id, ...obj } = (await result).ops[0]
    const mapAccout = Object.assign({}, obj, {id: _id}) 
    return mapAccout
  }  
    
  
}