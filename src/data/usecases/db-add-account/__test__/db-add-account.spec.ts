import { DbAddAccount } from '../db-add-account';
import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from '../db-add-account-protocols';

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    public hash(vallue: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed-password'));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository();
  const hasherStub = makeHasher();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);
  return {
    addAccountRepositoryStub,
    sut,
    hasherStub,
  };
};

const makeFakeAccountModel = (): AddAccountModel => ({
  name: 'valid-name',
  email: 'valid-mail',
  password: 'valid-password',
});

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(makeFakeAccountModel());
    expect(hasherSpy).toHaveBeenCalledWith('valid-password');
  });

  it('Should throw if Hasher throw', async () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeAccountModel());
    await expect(promise).rejects.toThrow();
    //Garanti que o try-catch nao será implementado justamente para o erro ser lançado a diante
  });

  it('Should calls addAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const addAccountModel = {
      name: 'valid-name',
      email: 'valid-mail',
      password: 'hashed-password',
    };
    await sut.add(addAccountModel);
    expect(addSpy).toHaveBeenCalledWith(addAccountModel);
  });
});
