import request from 'supertest'
import app from '../config/app'

describe('Content Type', ()=>{
  it('Shoul return default content type json', async () => {
    app.get('/test-content-type-json', (req, res)=> {
      res.send('')
    })

    await request(app)
    .get('/test-content-type-json')
    .expect('content-type', /json/)
    //existe algumas formas de definir o conten-type com json
    //algumas possuem char-set etc. 
    //logo o RegExp  para achar qualquer json 
  })

  it('Should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})