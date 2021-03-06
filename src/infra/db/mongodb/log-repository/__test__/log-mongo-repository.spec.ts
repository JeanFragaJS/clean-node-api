import { MongoHelper } from '../../helpers/mongo-helpers';
import env from '../../../../../main/config/env';
import { Collection } from 'mongodb';
import { LogMongoRepository } from '../log-mongo-repository';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect( env.mongoUrl );
    //mongodb://127.0.0.1:27017/
  });

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any-error');
    const countErrors = await errorCollection.countDocuments();
    expect(countErrors).toBe(1);
  });
});
