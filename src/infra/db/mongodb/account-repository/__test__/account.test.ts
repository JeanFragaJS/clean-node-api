import { MongoHelper } from '../../helpers/mongo-helpers'
import { AccountMongoRepository } from '../account'
import env from '@src/main/config/env'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository
}

describe('Account Mondo Repository', ()=> {
  
  beforeAll( async ()=> {
      await MongoHelper.connect(env.mongoUrl)
      //mongodb://127.0.0.1:27017/
  })

  beforeEach( async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    accountCollection.deleteMany({})
  })

  afterAll( async ()=> {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    const sut = makeSut()
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
