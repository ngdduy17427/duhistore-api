import { Request, Response } from "express";
import moment from "moment";
import { ObjectId } from "mongodb";
import { PurchaseStatus } from "../../../Constants/Enum";
import { EActionProductQuantity, EProductQuantity } from "../../../Database/Model/Product/product.model";
import purchaseModel, { IPurchase } from "../../../Database/Model/Purchase/purchase.model";
import { responseHelper } from "../../../Helper/reponse.helper";
import productController from "../Product/product.controller";

const purchaseController = {
  findAll: (req: Request, res: Response) => {
    purchaseModel
      .findAll(req.query)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    purchaseModel
      .findById(req.params._id)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  insert: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();

    let totalPrice = 0;

    for (const [index, product] of req.body.products.entries()) {
      req.body.products[index]._id = new ObjectId(product._id);

      totalPrice += parseInt(product.totalPrice);
    }

    const newData: IPurchase = {
      products: req.body.products,
      totalPrice: totalPrice,
      status: PurchaseStatus.PACKING,
      isReceived: false,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };

    purchaseModel
      .insert(newData)
      .then(async (resultData: any) => {
        for await (const product of resultData.products) {
          await productController.updateProductQuantity(
            product._id,
            product.quantity,
            EActionProductQuantity.INCREMENT,
            EProductQuantity.QUANTITY_PURCHASE
          );
        }

        return responseHelper(res, resultData, "Created!").Created();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body._id) return responseHelper(res, undefined, "Data id can not be empty!").BadRequest();

    purchaseModel
      .findById(req.body._id)
      .then((resultDataFound: any) => {
        const isReceivedTemp = resultDataFound.isDelivered;

        resultDataFound.status = req.body.status;
        resultDataFound.updatedAt = moment().valueOf();

        if (req.body.status === PurchaseStatus.RECEIVED) resultDataFound.isReceived = true;

        purchaseModel
          .update(resultDataFound._id, resultDataFound)
          .then(async (resultData: any) => {
            // Update Product quantity
            if (!isReceivedTemp && resultData.status === PurchaseStatus.RECEIVED) {
              for await (const product of resultData.products) {
                await productController.updateProductQuantity(
                  product._id,
                  product.quantity,
                  EActionProductQuantity.DECREMENT,
                  EProductQuantity.QUANTITY_PURCHASE
                );
                await productController.updateProductQuantity(
                  product._id,
                  product.quantity,
                  EActionProductQuantity.INCREMENT,
                  EProductQuantity.QUANTITY
                );
              }
            }

            return responseHelper(res, resultData, "Updated!").Success();
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
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    purchaseModel
      .delete(req.params._id)
      .then(async (resultData: any) => {
        if (resultData.status === PurchaseStatus.PACKING) {
          for await (const product of resultData.products) {
            await productController.updateProductQuantity(
              product._id,
              product.quantity,
              EActionProductQuantity.DECREMENT,
              EProductQuantity.QUANTITY_PURCHASE
            );
          }
        }

        return responseHelper(res, resultData, "Deleted!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  summary: (_: Request, res: Response) => {
    purchaseModel
      .summary()
      .then((resultData: any) => {
        return responseHelper(res, resultData, "Summary!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default purchaseController;
