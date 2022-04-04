import { AddAccountRepository } from "@src/data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "@src/data/protocols/db/load-account-by-email-repositroty";
import { AccountModel } from "@src/domain/models/account";
import {AddAccountModel} from '@src/data/usecases/add-account/db-add-account-protocols'
import { MongoHelper } from "../helpers/mongo-helpers";
import { UpdateAccessTokenRepository } from "@src/data/protocols/db/update-access-token";

export class AccountMongoRepository implements 
AddAccountRepository, 
LoadAccountByEmailRepository,
UpdateAccessTokenRepository

{
  
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account =  (await accountCollection.insertOne(accountData)).ops[0]
    return MongoHelper.map(account)
  }      

  public async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email: email })
    return  account && MongoHelper.map(account)
  }

  public async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: 
      { accessToken: token }
    })
  }

}

