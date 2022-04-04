import { MongoHelper } from '../../helpers/mongo-helpers'
import { AccountMongoRepository } from '../account'
import env from '@src/main/config/env'
import { Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository
}

describe('Account Mongo Repository', ()=> {

  let accountCollection: Collection
  
  beforeAll( async ()=> {
      await MongoHelper.connect(env.mongoUrl)
      //mongodb://127.0.0.1:27017/
  })

  beforeEach( async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    accountCollection.deleteMany({})
  })

  afterAll( async ()=> {
    await MongoHelper.disconnect()
  })

  it('Should return an account on add success', async () => {
    const sut = makeSut()
    const dataFake = {
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password'
    }
    const account = await sut.add(dataFake)
  
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any-name')
    expect(account.email).toBe('any@mail.com')
    expect(account.password).toBe('any-password')

  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    accountCollection.insertOne( {
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password'
    })

    const account = await sut.loadByEmail('any@mail.com')
  
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any-name')
    expect(account.email).toBe('any@mail.com')
    expect(account.password).toBe('any-password')

  })


})
