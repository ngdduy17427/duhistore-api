import { ObjectId, ReturnDocument } from "mongodb";
import mongoDB from "../..";

export enum EActionProductQuantity {
  INCREMENT = "increment",
  DECREMENT = "decrement",
}

export enum EProductQuantity {
  QUANTITY = "quantity",
  QUANTITY_ORDER = "quantityOrder",
  QUANTITY_PURCHASE = "quantityPurchase",
}

export interface IProduct {
  _id?: ObjectId;
  name: string;
  price: number;
  quantity: number;
  quantityOrder: number;
  quantityPurchase: number;
  createdAt: number;
  updatedAt: number;
}

export const productConfig = {
  COLLECTION: "products",
};

const productModel = {
  findAll: (query: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let collection = await mongoDB
          .collection(productConfig.COLLECTION)
          .find({ name: { $regex: query.search ?? "" } })
          .sort({ name: 1 })
          .toArray();

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  findById: (dataId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await mongoDB.collection(productConfig.COLLECTION).findOne({ _id: new ObjectId(dataId) });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  insert: (data: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const inserted = await mongoDB.collection(productConfig.COLLECTION).insertOne(data);
        const collection = await mongoDB.collection(productConfig.COLLECTION).findOne({ _id: inserted.insertedId });

        return resolve(collection);
      } catch (error) {
        return reject(error);
      }
    });
  },
  update: (dataID: number, data: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await mongoDB.collection(productConfig.COLLECTION).findOneAndUpdate(
          { _id: new ObjectId(dataID) },
          {
            $set: data,
          },
          { returnDocument: ReturnDocument.AFTER }
        );

        return resolve(updated.value);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default productModel;
