import app from './config/app'
import env from './config/env'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helpers'

MongoHelper.connect(env.mongoUrl)
  .then( async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, ()=> console.log(`listen on port ${env.port}`))
  })
  .catch(console.error)

  