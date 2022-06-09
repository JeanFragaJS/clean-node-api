import { AddAccount } from '@/domain/usecases/add-account';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DbAddAccount } from '@/data/usecases/db-add-account/db-add-account';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository); //db add account vai pro signup controller
};
