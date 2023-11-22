import { ObjectId } from "mongodb";
import mongoDB from "../..";

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
        let collection = mongoDB.collection(config.COLLECTION).find().sort({ updatedAt: -1 }).toArray();

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  findById: (dataId: string) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDB.collection(config.COLLECTION).findOne({ _id: new ObjectId(dataId) });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  insert: (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDB.collection(config.COLLECTION).insertOne(data);

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  update: (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDB
          .collection(config.COLLECTION)
          .updateOne({ _id: new ObjectId(data._id) }, { $set: data });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  delete: (dataId: string) => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDB.collection(config.COLLECTION).deleteOne({ _id: new ObjectId(dataId) });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  summary: () => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDB
          .collection(config.COLLECTION)
          .aggregate([{ $group: { _id: null, sumTotalPrice: { $sum: "$totalPrice" }, sumCount: { $sum: 1 } } }])
          .toArray();

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default purchaseModel;
