import { DbAddAccount } from '../db-add-account';
import { Hasher, AddAccountModel, AccountModel, AddAccountRepository, LoadAccountByEmailRepository } from '../db-add-account-protocols';

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

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public loadByEmail(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository 
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const addAccountRepositoryStub = makeAddAccountRepository();
  const hasherStub = makeHasher();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);
  return {
    addAccountRepositoryStub,
    sut,
    hasherStub,
    loadAccountByEmailRepositoryStub
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.com',
  password: 'any-hashed-password',
});

const makeFakeAccountModel = (): AddAccountModel => ({
  name: 'valid-name',
  email: 'any@mail.com',
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

  it('Should calls LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.add(makeFakeAccountModel());
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAccountModel().email);
  });

  it('Should return null if LoadAccountByEmailRepository not returns null', async () =>{
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(() => Promise.resolve(makeFakeAccount()))

    const promise = await sut.add(makeFakeAccountModel());
    expect(promise).toBe(null)
  })
});
