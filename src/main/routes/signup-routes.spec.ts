import request from 'supertest'
import app from '@src/main/config/app'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helpers' 
import env from '../config/env'

describe('SignUp Routes', ()=> {  
  beforeAll( async ()=> {
    await MongoHelper.connect(env.mongoUrl)
  })

beforeEach( async () => {
  const accountCollection = await MongoHelper.getCollection('accounts')
  accountCollection.deleteMany({})
})

afterAll( async ()=> {
  await MongoHelper.disconnect()
})
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Jean',
        email: 'jean@gmail.com',
        password: '123',
        confirmPassword: '123'
      })
      .expect(200)
  })    
})