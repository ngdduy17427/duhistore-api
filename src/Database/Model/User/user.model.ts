import { ObjectId } from "mongodb";
import { mongoDBCollection } from "../../mongoDB";

const config = {
  COLLECTION: "users",
};

const userModel = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).find().limit(10).sort({ updated: -1 }).toArray();

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  findById: (dataId: string) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).findOne({ _id: new ObjectId(dataId) });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  findByUsername: (dataUsername: any) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).find({ username: dataUsername }).toArray();

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  insert: (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).insertOne(data);

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  update: (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).updateOne(
          { _id: new ObjectId(data._id) },
          { $set: data }
        );

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  delete: (dataId: string) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).deleteOne({ _id: new ObjectId(dataId) });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default userModel;
