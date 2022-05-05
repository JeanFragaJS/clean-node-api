import request from 'supertest'
import app from '@src/main/config/app'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helpers' 
import env from '../config/env'

describe('Login Routes', ()=> {  
  beforeAll( async ()=> {
    await MongoHelper.connect(env.mongoUrl)
  })

beforeEach( async () => {
  const accountCollection =  await MongoHelper.getCollection('accounts')
  accountCollection.deleteMany({})
})

afterAll( async ()=> {
  await MongoHelper.disconnect()
})
  describe('POST /signUp', () => {
    it('Should return 200 on signup', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          name: 'Jean',
          email: 'jean@gmail.com',
          password: '123',
          passwordConfirm: '123'
        })
        expect(response.statusCode).toBe(200)
    })  
  })
  
})