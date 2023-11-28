import { productConfig } from "../Product/product.model";

const match = (query: any) => {
  return query ? { $match: query } : undefined;
};

const sort = (query: any) => {
  return query ? { $sort: query } : undefined;
};

const mappedPurchaseData = [
  { $unwind: "$products" },
  {
    $lookup: {
      from: productConfig.COLLECTION,
      localField: "products._id",
      foreignField: "_id",
      as: "purchaseProduct",
    },
  },
  { $unwind: "$purchaseProduct" },
  {
    $group: {
      _id: "$_id",
      products: {
        $push: {
          _id: "$products._id",
          name: "$purchaseProduct.name",
          quantity: "$products.quantity",
          totalPrice: "$products.totalPrice",
        },
      },
      doc: { $first: "$$ROOT" },
    },
  },
  { $replaceRoot: { newRoot: { $mergeObjects: ["$doc", { products: "$products" }] } } },
  { $project: { purchaseProduct: 0 } },
];

const purchaseAggregate = {
  findAll: (query: any) => {
    const searchQuery = query.search;
    const sortQuery = query.sort;

    return [...mappedPurchaseData, searchQuery && match(searchQuery), sortQuery && sort(sortQuery)].filter(Boolean);
  },
  findOne: (query: any) => {
    const searchQuery = query.search;

    return [searchQuery && match(searchQuery), ...mappedPurchaseData].filter(Boolean);
  },
};

export default purchaseAggregate;
