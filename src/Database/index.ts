import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";

// Use .env
dotenv.config();

const mongoClient: MongoClient = new MongoClient(process.env.MONGODB_URI!);
let mongoClientDB: Db;

const mongoDB = {
  connectToMongoDB: async () => {
    await mongoClient
      .connect()
      .then((mongoClientConnection) => {
        mongoClientDB = mongoClientConnection.db(process.env.MONGODB_DATABASE!);
        mongoClientDB.command({ ping: 1 });

        console.log("> Duhi Store API successfully connected to MongoDB");
        console.log("> Database: %s", process.env.MONGODB_DATABASE!);
      })
      .catch((error) => {
        mongoClient.close();

        return Promise.reject(error);
      });
  },
  collection: (collection: string) => mongoClientDB.collection(collection),
};

export default mongoDB;
