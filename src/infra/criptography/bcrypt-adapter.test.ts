

import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<String> {
    return new Promise(resolve => resolve('hashed-value'))
  }
}))

const salt = 12
const makeSut = (salt:number): BcryptAdapter => {
   return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  


  it('Should call bcrypt with correct values', async ()=> {

    const sut = makeSut(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash') 
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('sould return a hashed value', async () => {
    const sut = makeSut(salt)
    const hashed = await sut.hash('any-value')
    expect(hashed).toBe('hashed-value')
  })

  it('Should throw if bcrypt throws ', async ()=> {
    const sut = makeSut(salt)
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce( () => { throw new Error })
    
    const promise =  sut.hash('any-value')
    expect(promise).rejects.toThrow()
  })

})