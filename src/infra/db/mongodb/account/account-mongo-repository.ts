import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repositroty';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/data/usecases/db-add-account/db-add-account-protocols';
import { MongoHelper } from '../helpers/mongo-helpers';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  public async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const res = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({_id: res.insertedId})
    return MongoHelper.map(account);
  }

  public async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email: email });
    return account && MongoHelper.map(account);
  }

  public async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: id },
      { $set: { accessToken: token } },
      { upsert: true }
    );
  }
}


