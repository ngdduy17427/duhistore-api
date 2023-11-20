import { ObjectId } from "mongodb";
import { mongoDBCollection } from "../../mongoDB";

export interface IOrderProduct {
  id: string;
  name?: string;
  quantity: number;
  totalPrice: number;
}

export interface IOrder {
  _id?: string;
  customer: string;
  address: string;
  phone: string;
  note: string;
  products: IOrderProduct[];
  totalPrice: number;
  status: number;
  createdAt: number;
  updatedAt: number;
}

const config = {
  COLLECTION: "orders",
};

const orderModel = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      try {
        const collection = mongoDBCollection(config.COLLECTION).find().sort({ updatedAt: -1 }).toArray();

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

export default orderModel;
