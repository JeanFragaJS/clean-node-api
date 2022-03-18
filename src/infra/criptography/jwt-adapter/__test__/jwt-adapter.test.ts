import jwt from 'jsonwebtoken'
import { JwtAdapter } from '../jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('access-token'))
  }

}))
const secretKey = 'any-secret-key'
const makeSut = ( secretKey: string): JwtAdapter => {
  return new JwtAdapter(secretKey)
}
describe('JwtAdapter', () => {
  
  it('Should calls jwt sign with correct values', async () => {
    const sut = makeSut(secretKey)
    const signSpy = jest.spyOn( jwt, 'sign')
    await sut.encrypt('any-id')
    expect(signSpy).toHaveBeenCalledWith('any-id', secretKey)
  })

  
})