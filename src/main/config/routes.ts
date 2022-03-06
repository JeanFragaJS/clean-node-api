import {Express, Router} from 'express'
import fastGlob from 'fast-glob'




export default  (app: Express): void => {

  const router = Router()
  app.use('/api', router)

  fastGlob.sync('**/src/main/routes/**routes.ts')
    .map(async file => { 
      (await import(`../../../${file}`)).default(router)
      //o arquivo retorna uma funçao 
      //default que espera receber um Router
  })
}