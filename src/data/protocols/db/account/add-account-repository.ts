import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account';
import { AccountModel } from '@/domain/models/account';

export class AddAccountRepository implements AddAccount {
  public async add(accountData: AddAccountModel): Promise<AccountModel> {
    return new Promise((resolve) => resolve(null));
  }
}
