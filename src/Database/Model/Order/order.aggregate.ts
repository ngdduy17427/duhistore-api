import { productConfig } from "../Product/product.model";

const match = (query: any) => {
  return query ? { $match: query } : undefined;
};

const sort = (query: any) => {
  return query ? { $sort: query } : undefined;
};

const mappedOrderData = [
  { $unwind: "$products" },
  {
    $lookup: {
      from: productConfig.COLLECTION,
      localField: "products._id",
      foreignField: "_id",
      as: "orderProduct",
    },
  },
  { $unwind: "$orderProduct" },
  {
    $group: {
      _id: "$_id",
      products: {
        $push: {
          _id: "$products._id",
          name: "$orderProduct.name",
          quantity: "$products.quantity",
          totalPrice: "$products.totalPrice",
        },
      },
      doc: { $first: "$$ROOT" },
    },
  },
  { $replaceRoot: { newRoot: { $mergeObjects: ["$doc", { products: "$products" }] } } },
  { $project: { orderProduct: 0 } },
];

const orderAggregate = {
  findAll: (query: any) => {
    const searchQuery = query.search;
    const sortQuery = query.sort;

    return [...mappedOrderData, searchQuery && match(searchQuery), sortQuery && sort(sortQuery)].filter(Boolean);
  },
  findOne: (query: any) => {
    const searchQuery = query.search;

    return [searchQuery && match(searchQuery), ...mappedOrderData].filter(Boolean);
  },
};

export default orderAggregate;
