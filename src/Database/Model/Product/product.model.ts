import { ObjectId } from "mongodb";
import mongoDB from "../..";

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  quantityOrder: number;
  quantityPurchase: number;
  createdAt: number;
  updatedAt: number;
}

const config = {
  COLLECTION: "products",
};

const productModel = {
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
  findByName: (dataName: string) => {
    return new Promise((resolve, reject) => {
      try {
        let collection = mongoDB.collection(config.COLLECTION).find({ name: dataName }).sort({ updated: -1 }).toArray();

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
};

export default productModel;
