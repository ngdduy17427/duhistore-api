import { MongoClient } from "mongodb";

const mongoDBClient = new MongoClient(
  "mongodb+srv://sum17427:sum051013@duhistore.lcau9ai.mongodb.net/?retryWrites=true&w=majority"
);

// Create MongoDB
let mongoDBConnection: any;
let mongoDB: any;

const connectToMongoDB = async () => {
  try {
    mongoDBConnection = await mongoDBClient.connect();

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connect to MongoDB failed!", error);
  }
};
connectToMongoDB().then(() => {
  mongoDB = mongoDBConnection.db("DuhiStore");
});

// MongoDB get collection
export const mongoDBCollection = (collection: string) => {
  return mongoDB.collection(collection);
};
