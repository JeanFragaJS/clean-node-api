import request from 'supertest'
import app from '../../main/config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import env from '../config/env'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  describe('POST /signUp', () => {
    it('Should return 200 on signup', async () => {
      const response = await request(app).post('/api/signup').send({
        name: 'Jean',
        email: 'jean@gmail.com',
        password: '123',
        passwordConfirm: '123',
      });
   // console.log(response)
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /login', () => {
    it('Should return 200 on Login', async () => {
      const password = await hash('12345', 12);

      await accountCollection.insertOne({
        name: 'Jean',
        email: 'jean@gmail.com',
        password,
      });

      const response = await request(app).post('/api/login').send({
        email: 'jean@gmail.com',
        password: '12345',
      });
      expect(response.statusCode).toBe(200);
    });

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'jean@gmail.com',
          password: '12345'
        })
        .expect(401)
    });
  });
});
