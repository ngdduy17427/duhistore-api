import { ObjectId, ReturnDocument } from "mongodb";
import mongoDB from "../../../Database";
import orderAggregate from "./order.aggregate";

export interface IOrderProduct {
  _id: ObjectId;
  name?: string;
  quantity: number;
  totalPrice: number;
}

export interface IOrder {
  _id?: ObjectId;
  customer: string;
  address: string;
  phone: string;
  note: string;
  products: IOrderProduct[];
  totalPrice: number;
  status: number;
  isDelivered: boolean;
  createdAt: number;
  updatedAt: number;
}

export const orderConfig = {
  COLLECTION: "orders",
};

const orderModel = {
  findAll: (query: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let collection = await mongoDB
          .collection(orderConfig.COLLECTION)
          .aggregate(
            orderAggregate.findAll({
              search: { "products.name": { $regex: query.search ?? "", $options: "i" } },
              sort: { updatedAt: -1 },
            })
          )
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
        const collection = await mongoDB
          .collection(orderConfig.COLLECTION)
          .aggregate(
            orderAggregate.findOne({
              search: { _id: new ObjectId(dataId) },
            })
          )
          .toArray();

        return resolve(collection[0]);
      } catch (error) {
        return reject(error);
      }
    });
  },
  insert: (data: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const inserted = await mongoDB.collection(orderConfig.COLLECTION).insertOne(data);
        const collection = await mongoDB
          .collection(orderConfig.COLLECTION)
          .aggregate(
            orderAggregate.findOne({
              search: { _id: inserted.insertedId },
            })
          )
          .toArray();

        return resolve(collection[0]);
      } catch (error) {
        return reject(error);
      }
    });
  },
  update: (dataID: number, data: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await mongoDB.collection(orderConfig.COLLECTION).findOneAndUpdate(
          { _id: new ObjectId(dataID) },
          {
            $set: data,
          },
          { returnDocument: ReturnDocument.AFTER }
        );
        const collection = await mongoDB
          .collection(orderConfig.COLLECTION)
          .aggregate(
            orderAggregate.findOne({
              search: { _id: updated.value?._id },
            })
          )
          .toArray();

        return resolve(collection[0]);
      } catch (error) {
        return reject(error);
      }
    });
  },
  delete: (dataId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleted = await mongoDB
          .collection(orderConfig.COLLECTION)
          .findOneAndDelete({ _id: new ObjectId(dataId) });

        return resolve(deleted.value);
      } catch (error) {
        return reject(error);
      }
    });
  },
  summary: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await mongoDB
          .collection(orderConfig.COLLECTION)
          .aggregate([{ $group: { _id: null, sumTotalPrice: { $sum: "$totalPrice" }, sumCount: { $sum: 1 } } }])
          .toArray();

        return resolve(collection[0]);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default orderModel;
