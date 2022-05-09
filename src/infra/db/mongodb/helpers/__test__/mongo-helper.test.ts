import {MongoHelper as sut} from '../mongo-helpers'
import env from '@/main/config/env'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })
  it('Should reconnect if mongodb down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection =  await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()

  })
})

