import { AddAccountRepository } from "@src/data/protocols/add-account-repository";
import { AccountModel } from "@src/domain/models/account";
import {AddAccountModel} from '@src/data/usecases/add-account/db-add-account-protocols'
import { MongoHelper } from "../helpers/mongo-helpers";

export class AccountMongoRepository implements AddAccountRepository {
  
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = (await accountCollection.insertOne(accountData)).ops[0]
    return MongoHelper.map(account)
  }  
    
}