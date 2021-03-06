import bcrypt from 'bcrypt';
import { BcryptAdapter } from '../bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed-value'));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (salt: number): BcryptAdapter => {
  return new BcryptAdapter(salt);
};
describe('Bcrypt Adapter', () => {
  it('Should call bcryt hash with correct values', async () => {
    const sut = makeSut(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hashed value of the hash', async () => {
    const sut = makeSut(salt);
    const hashed = await sut.hash('any-value');
    expect(hashed).toBe('hashed-value');
  });

  it('Should throw if bcrypt hash throws ', async () => {
    const sut = makeSut(salt);
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash('any-value');
    expect(promise).rejects.toThrow();
  });

  it('Should call bcrypt compare  with correct values', async () => {
    const sut = makeSut(salt);
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any-value', 'hashed-value');
    expect(compareSpy).toHaveBeenCalledWith('any-value', 'hashed-value');
  });

  it('Should return true when bcrypt compare is successed', async () => {
    const sut = makeSut(salt);
    const isValid = await sut.compare('any-value', 'hashed-value');
    expect(isValid).toBe(true);
  });

  it('Should return false when bcrypt compare fails', async () => {
    const sut = makeSut(salt);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });

    const isValid = await sut.compare('any-value', 'hashed-value');
    expect(isValid).toBe(false);
  });

  it('Should throw if bcrypt compare throws', async () => {
    const sut = makeSut(salt);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare('any-value', 'hashed-value');
    expect(promise).rejects.toThrow();
  });
});
