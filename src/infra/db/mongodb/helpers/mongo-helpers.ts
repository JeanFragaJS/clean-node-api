import {MongoClient, Collection} from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
   await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
    // this method allows accessing mongoDB 
    // operative methods
    // https://docs.mongodb.com/manual/reference/method/
  
  },
  
  map: ( collection ): any => {
    const { _id, ...objectCollection } = collection
    return Object.assign({}, objectCollection, { id: _id } )
  }
}