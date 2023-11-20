import { ObjectId } from "mongodb";
import { mongoDBCollection } from "../../mongoDB";

export interface IPurchaseProduct {
  id: string;
  name?: string;
  quantity: number;
  totalPrice: number;
}

export interface IPurchase {
  _id?: string;
  products: IPurchaseProduct[];
  totalPrice: number;
  status: number;
  createdAt: number;
  updatedAt: number;
}

const config = {
  COLLECTION: "purchases",
};

const purchaseModel = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      try {
        let collection = mongoDBCollection(config.COLLECTION).find().sort({ updatedAt: -1 }).toArray();

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

export default purchaseModel;
