import bcrypt, { hash } from 'bcrypt'
import { setDefaultResultOrder } from 'dns'
import { BcryptAdapter } from './bcrypt-adapter'
jest.mock('bcrypt', () => ({
  async hash(): Promise<String> {
    return new Promise(resolve => resolve('hashed-value'))
  }
}))


describe('Bcrypt Adapter', () => {
  const salt = 12

  it('Should call bcrypt with correct values', async ()=> {

    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash') 
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('sould return a hashed value', async () => {
    const sut = new BcryptAdapter(salt) 
    const hashed = await sut.encrypt('any-value')
    expect(hashed).toBe('hashed-value')
  })
})