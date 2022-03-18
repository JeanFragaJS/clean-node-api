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

  it('Should return accessToken if sign jwt is success', async () => {
    const sut = makeSut(secretKey)
    const accessToken = await sut.encrypt('any-id')
    expect(accessToken).toEqual(expect.any(String))
  })

  it('Should throws if jwt sign throws', async () => {
    const sut = makeSut(secretKey)
    jest.spyOn(jwt, 'sign').mockImplementationOnce(()=> {
      throw new Error
    })

    const promise = sut.encrypt('any-id')
    await expect(promise).rejects.toThrow()
  })
})