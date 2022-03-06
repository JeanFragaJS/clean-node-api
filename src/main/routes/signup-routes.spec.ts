import request from 'supertest'
import app from '@src/main/config/app'

describe('SignUp Routes', ()=> {
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