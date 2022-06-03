import { Express, Router } from 'express';
import {readdirSync} from 'fs'


export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  /* 
    importa arquivos de forma 
    sincrona sem especificar a 
    extensão por conta do build 
    do tsc.
  */
  readdirSync(`${__dirname}/../routes`).map( async file => {
    if (!file.includes('.test.') && !file.includes('map')) {
      (await import(`../routes/${file}`)).default(router)
      //console.log(file)
    }
  })
};
