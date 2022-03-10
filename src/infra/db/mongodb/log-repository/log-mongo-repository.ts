import { LogErrorRepository } from "@src/data/protocols/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helpers";

export class LogMongoRepository implements LogErrorRepository {
  public async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}