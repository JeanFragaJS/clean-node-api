import { MongoHelper } from '../../helpers/mongo-helpers';
import { AccountMongoRepository } from '../account-mongo-repository';
import env from '../../../../../main/config/env';
import { Collection } from 'mongodb';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
    //mongodb://127.0.0.1:27017/
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return an account on add success', async () => {
    const sut = makeSut();
    const dataFake = {
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password',
    };
    const account = await sut.add(dataFake);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any@mail.com');
    expect(account.password).toBe('any-password');
  });

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut();
    accountCollection.insertOne({
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password',
    });

    const account = await sut.loadByEmail('any@mail.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any@mail.com');
    expect(account.password).toBe('any-password');
  });

  it('Should return null if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any@mail.com');
    expect(account).toBeFalsy();
  });

  it('Should update account accessToken if updateAccessToken on success', async () => {
    const sut = makeSut();
    const res = await accountCollection.insertOne({
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password',
    });
    const fakeAccount = res.ops[0];
    expect(fakeAccount.accessToken).toBeFalsy();
    await sut.updateAccessToken(fakeAccount._id, 'any-token');
    const account = await accountCollection.findOne({ _id: fakeAccount._id });
    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any-token');
  });
});
