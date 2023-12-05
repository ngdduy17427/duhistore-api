import { ObjectId, ReturnDocument } from "mongodb";
import mongoDB from "../../../Database";
import purchaseAggregate from "./purchase.aggregate";

export interface IPurchaseProduct {
  _id: ObjectId;
  name?: string;
  quantity: number;
  totalPrice: number;
}

export interface IPurchase {
  _id?: ObjectId;
  products: IPurchaseProduct[];
  totalPrice: number;
  status: number;
  isReceived: boolean;
  createdAt: number;
  updatedAt: number;
}

export const purchaseConfig = {
  COLLECTION: "purchases",
};

const purchaseModel = {
  findAll: (query: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let collection = await mongoDB
          .collection(purchaseConfig.COLLECTION)
          .aggregate(
            purchaseAggregate.findAll({
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
          .collection(purchaseConfig.COLLECTION)
          .aggregate(
            purchaseAggregate.findOne({
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
        const inserted = await mongoDB.collection(purchaseConfig.COLLECTION).insertOne(data);
        const collection = await mongoDB
          .collection(purchaseConfig.COLLECTION)
          .aggregate(
            purchaseAggregate.findOne({
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
        const updated = await mongoDB.collection(purchaseConfig.COLLECTION).findOneAndUpdate(
          { _id: new ObjectId(dataID) },
          {
            $set: data,
          },
          { returnDocument: ReturnDocument.AFTER }
        );
        const collection = await mongoDB
          .collection(purchaseConfig.COLLECTION)
          .aggregate(
            purchaseAggregate.findOne({
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
          .collection(purchaseConfig.COLLECTION)
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
          .collection(purchaseConfig.COLLECTION)
          .aggregate([{ $group: { _id: null, sumTotalPrice: { $sum: "$totalPrice" }, sumCount: { $sum: 1 } } }])
          .toArray();

        return resolve(collection[0]);
      } catch (error) {
        return reject(error);
      }
    });
  },
};

export default purchaseModel;
