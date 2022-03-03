import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account'
describe('Account Mondo Repository', ()=> {
  beforeAll( async ()=> {
      await MongoHelper.connect('mongodb://127.0.0.1:27017/')
  })

  afterAll( async ()=> {
    await MongoHelper.disconnect()
  })
  it('Should return an account on success', async () => {
    const sut =  new AccountMongoRepository()
    const dataFake = {
      name: 'any-name',
      email: 'any@mail',
      password: 'any-password'
    }
    const account = await sut.add(dataFake)
  
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any-name')
    expect(account.email).toBe('any@mail')
    expect(account.password).toBe('any-password')

  })
})
