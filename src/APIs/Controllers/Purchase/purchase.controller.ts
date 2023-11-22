import { Request, Response } from "express";
import moment from "moment";
import { PurchaseStatus } from "../../../Constants/Enum";
import productModel, { IProduct } from "../../../Database/Model/Product/product.model";
import purchaseModel, { IPurchase } from "../../../Database/Model/Purchase/purchase.model";
import { responseHelper } from "../../../Helper/reponse.helper";
import productController from "../Product/product.controller";

const mapPurchaseData = async (data: IPurchase) => {
  const productsMapped = [];

  for await (const product of data.products) {
    const productFulfilled = (await productModel.findById(product.id)) as IProduct;

    productsMapped.push({ ...product, name: productFulfilled?.name });
  }

  return {
    id: data._id,
    products: productsMapped,
    totalPrice: data.totalPrice,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const purchaseController = {
  findAll: (_: Request, res: Response) => {
    purchaseModel
      .findAll()
      .then(async (result: any) => {
        const purchaseList = [];

        for await (const purchase of result) {
          const purchaseMapped = await mapPurchaseData(purchase);

          purchaseList.push(purchaseMapped);
        }

        return responseHelper(res, purchaseList, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    purchaseModel
      .findById(req.params.id)
      .then((result) => {
        return responseHelper(res, result, "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  insert: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();

    const totalPrice = req.body.products.reduce((total: number, product: any) => {
      return total + parseInt(product.totalPrice);
    }, 0);

    const newData: IPurchase = {
      products: req.body.products,
      status: PurchaseStatus.PACKING,
      totalPrice: totalPrice,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };

    purchaseModel
      .insert(newData)
      .then(async (_) => {
        for await (const product of req.body.products) {
          await productController.updateProductQuantity(product.id, product.quantity, "increase", "quantityPurchase");
        }

        const purchaseMapped = await mapPurchaseData(newData);

        return responseHelper(res, purchaseMapped, "Created!").Created();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.id) return responseHelper(res, undefined, "Data id can not be empty!").BadRequest();

    purchaseModel
      .findById(req.body.id)
      .then((result: any) => {
        result.status = req.body.status;
        result.updatedAt = moment().valueOf();

        purchaseModel
          .update(result)
          .then(async () => {
            if (req.body.status === PurchaseStatus.RECEIVED) {
              for await (const product of req.body.products) {
                await productController.updateProductQuantity(
                  product.id,
                  product.quantity,
                  "decrease",
                  "quantityPurchase"
                );
              }
              for await (const product of req.body.products) {
                await productController.updateProductQuantity(product.id, product.quantity, "increase", "quantity");
              }
            }

            const purchaseMapped = await mapPurchaseData(result);

            return responseHelper(res, purchaseMapped, "Updated!").Success();
          })
          .catch((error) => {
            return responseHelper(res, undefined, error.message).InternalServerError();
          });
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  delete: (req: Request, res: Response) => {
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    purchaseModel
      .findById(req.params.id)
      .then((result: any) => {
        purchaseModel
          .delete(req.params.id)
          .then(async () => {
            if (result.status === PurchaseStatus.PACKING) {
              for await (const product of result.products) {
                await productController.updateProductQuantity(
                  product.id,
                  product.quantity,
                  "decrease",
                  "quantityPurchase"
                );
              }
            }

            return responseHelper(res, req.params.id, "Deleted!").Success();
          })
          .catch((error) => {
            return responseHelper(res, undefined, error.message).InternalServerError();
          });
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  summary: (_: Request, res: Response) => {
    purchaseModel
      .summary()
      .then((result: any) => {
        return responseHelper(res, result[0], "Summary!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default purchaseController;
